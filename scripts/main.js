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
        this.removeAllSubMenus();
        this.removeAllActiveStateAndApplyActiveStateToCurrentElement(e);
        this.setPageURLToCurrentElementURL(e);
        page.loadFile();
      } else {
        return;
      }
    },
    removeAllSubMenus: function () {
      var submenu = document.querySelectorAll('[data-gumshoe]');
      for (var i = 0; i < submenu.length; i++) {
        submenu[i].parentNode.removeChild(submenu[i]);
      }
    },
    removeAllActiveStateAndApplyActiveStateToCurrentElement: function (e) {
      var menuArray = document.querySelectorAll('.js-phytoplankton-menu a');
      for (var i = 0; i < menuArray.length; i++) {
        menuArray[i].classList.remove('is-active');
      }
      e.target.classList.add('is-active');
    },
    setPageURLToCurrentElementURL: function (e) {
        page.url = e.target.dataset.url;
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
    this.getMainPreProcessorStyleSheet();
  },
  beforeMount: function () {
    console.log('beforeMount');
  },
  mounted: function () {
    console.log('mounted');

    this.setFirstMenuItemToActive();
    this.setPageURLToFirstMenuItem();
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

    this.addLineNumberClass();
    this.appendMenu();
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
  methods: {
    setFirstMenuItemToActive: function () {
      document.querySelectorAll('.js-phytoplankton-menu a')[0].classList.add('is-active');
    },
    setPageURLToFirstMenuItem: function () {
      this.url = config.menu[0].url[0];
    },
    addLineNumberClass: function () {
      var pre = document.getElementsByTagName('pre');
      for (var i = 0, length = pre.length; i < length; i++) {
        pre[i].classList.add('line-numbers');
      }
    },
    appendMenu: function () {
      $('[data-url="' + this.url + '"]').parent().append(this.createMenu(page.headings));
    },
    removeStyles: function () {
      var styles = document.head.querySelectorAll('style');
      if (styles.length) {
        for (var i = 0; i < styles.length; i++) {
          styles[i].parentNode.removeChild(styles[i]);
        }
      }
    },
    getMainPreProcessorStyleSheet: function () {
      var styleSheetPath = window.location.origin + window.location.pathname;
      $.ajax({
          url: 'main.styl',
          async: false,
          cache: true,
          success: function(data){
              allImports = findImports(data, styleSheetPath, 'styl');
              console.log(allImports);
          }
      });
    },
    getHeadings: function (block) {
      var match;
      var regex = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/gm;
      while ((match = regex.exec(block.docs)) !== null) {
        page.headings.push(match[0]);
      }
    },
    loadFile: function () {

      // Resets
      this.blocks = [];
      this.headings = [];
      this.removeStyles();

      var rq = new XMLHttpRequest();

      rq.onreadystatechange = function(page) {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            var blocks = separate(this.responseText);

            for (var i = 0; i < blocks.length; i++) {
              var tokens = marked.lexer(blocks[i].docs);
              var links = tokens.links || {};
              var block = {
                docs: [],
                code: ''
              };

              page.getHeadings(blocks[i]);

              var cleanCode = removeComments(blocks[i].code);
              if (cleanCode !== '') {
                block.code = computeCss(cleanCode);
              }

              for (var j = 0; j < tokens.length; j++) {
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
    },
    createMenu: function (headings) {
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
  }
})
