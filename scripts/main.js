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
      } else {
        return;
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

// var loader = new Vue({
//   el: '.js-phytoplankton-page--loader',
//   data: {
//     message: 'Loading...',
//     seen: true
//   }
// });

var page = new Vue({
  el: '.js-phytoplankton-page',
  data: {
    url: '',
    blocks: [],
    headings: []
  },
  beforeCreate: function () {
    console.log('beforeCreate');
  },
  created: function () {
    console.log('created');
    var path = window.location.origin + window.location.pathname;
    $.ajax({
        url: 'main.styl',
        async: false,
        cache: true,
        success: function(data){
            allImports = findImports(data, path, 'styl');
            console.log(allImports);
        }
    });
  },
  beforeMount: function () {
    console.log('beforeMount');
  },
  mounted: function () {
    console.log('mounted');
    // Set first menu link's state to "active".
    document.querySelectorAll('.js-phytoplankton-menu a')[0].classList.add('is-active');
    // Set page URL to first menu item.
    this.url = config.menu[0].url[0];
    // Load first file.
    this.loadFile();
  },
  // computed: {
  //   computed: function () {
  //     return  console.log('computed');
  //   },
  //   compiledMarkdown: function () {
  //     return this.docs
  //     // return marked(this.docs, {
  //     //   sanitize: false,
  //     //   gfm: true,
  //     //   tables: true,
  //     //   langPrefix: 'language-'
  //     // })
  //   }
  // },
  beforeUpdate: function () {
    console.log('beforeUpdate');
  },
  updated: function () { // "onReady function"
    console.log('updated');
    var pre = document.getElementsByTagName('pre');
    for (var i = 0, length = pre.length; i < length; i++) {
      pre[i].classList.add('line-numbers');
    }

    function createMenu(headings) {
        let i = 0;
        const tags = [];

        (function recurse(depth) {
            let unclosedLi = false;
            while (i < headings.length) {
                const [hashes, data] = headings[i].split("# ");
                if (hashes.length < depth) {
                    break;
                } else if (hashes.length === depth) {
                    if (unclosedLi) tags.push('</li>');
                    unclosedLi = true;
                    var anchor = data.toLowerCase().trim().replace(/[^\w]+/g, '-');
                    tags.push('<li>');
                    tags.push('<a href="#' + anchor +'" data-scroll>', data.trim());
                    tags.push('</a>');
                    i++;
                } else {
                    if (i === 0) {
                        tags.push('<ul data-gumshoe>');
                    } else {
                        tags.push('<ul>');
                    }
                    recurse(depth+1);
                    tags.push('</ul>');
                }
            }
            if (unclosedLi) tags.push('</li>');
        })(-1);
        return tags.join('');
    }

    $('[data-url="' + this.url + '"]').parent().append(createMenu(page.headings));

    Prism.highlightAll();
    Prism.fileHighlight();
    fixie.init();
    smoothScroll.init({
      offset: 48
    });
    gumshoe.init({
      offset: 49
    });
  },
  // activated: function () {
  //   console.log('activated');
  // },
  // deactivated: function () {
  //   console.log('deactivated');
  // },
  // beforeDestroy: function () {
  //   console.log('beforeDestroy');
  // },
  // destroyed: function () {
  //   console.log('destroyed');
  // },
  methods: {
    loadFile: function() {

      // Resets
      this.blocks = [];
      this.headings = [];

      var styles = document.head.querySelectorAll('style');
      if (styles.length) {
        for (var i = 0, lengthStyles = styles.length; i < lengthStyles; i++) {
          styles[i].parentNode.removeChild(styles[i]);
        }
      }

      var rq = new XMLHttpRequest();

      rq.onreadystatechange = function(page) {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            var blocks = separate(this.responseText);

            for (var i = 0, lengthBlocks = blocks.length; i < lengthBlocks; i++) {
              var tokens = marked.lexer(blocks[i].docs);
              var links = tokens.links || {};
              var block = {
                docs: [],
                code: ''
              };

              var match;
              var regex = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/gm;
              while ((match = regex.exec(blocks[i].docs)) !== null) {
                page.headings.push(match[0]);
              }

              var cleanCode = removeComments(blocks[i].code);
              if (cleanCode !== '') {
                block.code = computeCss(cleanCode);
              }

              for (var j = 0, lengthTokens = tokens.length; j < lengthTokens; j++) {
                switch (tokens[j].type) {
                  case 'code':
                    if (!tokens[j].lang) {
                      block.docs.push(tokens[j]);
                    } else if (tokens[j].lang === 'markup') {
                      block.docs.push({
                        type: 'html',
                        lang: 'markup',
                        text: '<ul class="phytoplankton-tabs">' +
                              '<li class="phytoplankton-tabs__item is-active">HTML</li>' +
                              '</ul>' +
                              '<div class="code-render clearfix">' + tokens[j].text + '</div>'
                      });
                    }
                  break;
                  default:
                    block.docs.push(tokens[j]);
                  break;
                }
              }

              block.docs.links = links;
              block.docs = marked.parser(block.docs);
              page.blocks.push(block);
            }
          } else {
            return
            // loader.message = '**Request Failed!**\n\nEither the file the extension *(.css, .stylus, .styl, .less, .sass, .scss)* in `config.menu.url` is missing or the file just doesn\'t exist.';
            // loader.message = marked(loader.message);
          }
        }
      }.bind(rq, this);

      rq.open("GET", this.url);
      rq.send();
    }
  }
})
