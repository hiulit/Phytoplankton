// var lala = separate('/* # adeu bon dia \n hola com va? \n > quote*/ \n .hola {color: red;}');
// var docs = lala[0].docs;
// var css = lala[0].code;

// var parse = gonzales.parse(css);

Vue.component('menu-item', {
  props: ['menu'],
  template: '<li class="phytoplankton-menu__list__item">' +
              '<div class="phytoplankton-menu__list__item__header">' +
                '{{ menu.title }}' +
              '</div>' +
              '<ul class="phytoplankton-menu__list">' +
                '<li class="phytoplankton-menu__list__item" v-for="url in menu.url">' +
                  '<a class="phytoplankton-menu__list__item__subheader" v-bind:data-url="url" @click="goToFile">{{ url }}</a>' +
                '</li>' +
              '</ul>' +
            '</li>',
  // data: {
  // },
  methods: {
    goToFile: function(e) {
      if (page.url != e.target.dataset.url) {
        var submenu = document.querySelectorAll('[data-gumshoe]');
        for (var i = 0, length = submenu.length; i < length; i++) {
          submenu[i].parentNode.removeChild(submenu[i]);
        }
        var menuArray = document.querySelectorAll('.js-phytoplankton-menu a');
        for (var i = 0, length = menuArray.length; i < length; i++) {
          menuArray[i].classList.remove('is-active');
        }
        e.target.classList.add('is-active');
        page.url = e.target.dataset.url;
        page.loadFile();
      }
    }
  }
})

// To add new items -> menu.menu.push({text: 'new item', url: 'new url'})
var menu = new Vue({
  el: '.js-phytoplankton-menu',
  data: {
    items: config.menu
  }
})

Vue.component('page-item', {
    props: ['page'],
    template: '<div class="phytoplankton-page__item"></div>',
    // data: {
    // },
    // methods: {
    // }
});

var page = new Vue({
  el: '.js-phytoplankton-page',
  data: {
    url: '',
    docs: '',
    css: '',
    blocks: []
  },
  methods: {
    loadFile: function() {
      this.docs = 'Requesting ...';
      var rq = new XMLHttpRequest();

      rq.onreadystatechange = function(page) {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            var items = separate(this.responseText);
            page.docs = '';

            for (var i = 0, length = items.length; i < length; i++) {
              page.docs += items[i].docs;
              // page.css += items[i].css;

              // var block = {
              //   docs: items[i].docs,
              //   // css: items[i].css
              // };
              // page.blocks.push(block)
            };

            var tokens = marked.lexer(page.docs);
            var links = tokens.links || {};
            var block = {
              docs: [],
              css: []
            };

            for (var i = 0, length = tokens.length; i < length; i++) {
              switch (tokens[i].type) {
                case 'code':
                  if (tokens[i].lang === 'markup') {
                    block.docs.push({
                      type: 'html',
                      lang: 'markup',
                      text: '<ul class="phytoplankton-tabs">' +
                            '<li class="phytoplankton-tabs__item is-active">HTML</li>' +
                            '</ul>' +
                            '<div class="code-render clearfix">' + tokens[i].text + '</div>'
                    });
                  }
                break;
                default:
                  block.docs.push(tokens[i]);
                break;
              }
            }
            block.docs.links = links;
            block.docs = marked.parser(block.docs);
            page.docs = block.docs;
          } else {
            page.docs = '**Request Failed!**\n\n' +
                           'Either the file the extension *(.css, .stylus, .styl, .less, .sass, .scss)* in `config.menu.url` is missing or the file just doesn\'t exist.';
            page.docs = marked(page.docs);
          }
        }
      }.bind(rq, this);

      rq.open("GET", this.url);
      rq.send();
    }
  },
  computed: {
    compiledMarkdown: function() {
      return this.docs
      // return marked(this.docs, {
      //   sanitize: false,
      //   gfm: true,
      //   tables: true,
      //   langPrefix: 'language-'
      // })
    }
  },
  updated: function() { // "onReady function"
    var pre = document.getElementsByTagName('pre');
    for (var i = 0, length = pre.length; i < length; i++) {
      pre[i].classList.add('line-numbers');
    }

    var headings = document.querySelectorAll('h1');
    var submenu = document.createElement('ul');
    submenu.setAttribute('data-gumshoe', '');
    for (var i = 0, length = headings.length; i < length; i++) {
      var submenuItem = document.createElement('li');
      var submenuItemAnchor = document.createElement('a');
      submenuItem.appendChild(submenuItemAnchor);
      submenuItemAnchor.setAttribute('href', '#' + headings[i].id);
      submenuItemAnchor.setAttribute('data-scroll', '');
      submenuItemAnchor.appendChild(document.createTextNode(headings[i].innerText));
      submenu.appendChild(submenuItem);
    }
    document.querySelector('[data-url="' + this.url + '"]').parentNode.appendChild(submenu);

    Prism.highlightAll();
    Prism.fileHighlight();
    fixie.init();
    smoothScroll.init({
      offset: 48
    });
    gumshoe.init({
      offset: 49
    });
  }
})

// Set first menu link's state to "active".
document.querySelectorAll('.js-phytoplankton-menu a')[0].classList.add('is-active');
// Set page URL to first menu item.
page.url = config.menu[0].url[0];
// Load first file.
page.loadFile();
