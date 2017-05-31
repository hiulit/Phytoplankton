// var lala = separate('/* # adeu bon dia \n hola com va? \n > quote*/ \n .hola {color: red;}');
// var docs = lala[0].docs;
// var css = lala[0].code;

// var parse = gonzales.parse(css);

// console.log(parse);
// console.log(parse.toString());

// To convert input -> section.input = "foo bar"
// var section = new Vue({
//   el: '.section',
//   data: {
//     // message: 'new section',
//     input: '# hola'
//   },
//   computed: {
//     compiledMarkdown: function() {
//       return marked(this.input, {
//         sanitize: true
//       })
//     }
//   },
//   methods: {
//     update: _.debounce(function(e) {
//       this.input = e.target.value
//     }, 300)
//   }
// })
//
// section.input = "# hola";

Vue.component('menu-item', {
  props: ['menu'],
  template: '<li>' +
              '{{ menu.title }}' +
              '<ul>' +
                '<li v-for="url in menu.url">' +
                  '<a v-bind:data-url="url" @click="goToFile">{{ url }}</a>' +
                '</li>' +
              '</ul>' +
            '</li>',
  // data: {

  // },
  methods: {
    goToFile: function(e) {
      // section.url = this.menu.url;
      var menuArray = document.querySelectorAll('.js-phytoplankton-menu a');
      for (var i = 0, len = menuArray.length; i < len; i++) {
        menuArray[i].classList.remove('is-active');
      }
      e.target.classList.add('is-active');
      section.url = e.target.dataset.url;
      section.loadFile();
    }
  }
})

// To add new items -> menu.menu.push({text: 'new item'})
var menu = new Vue({
  el: '.js-phytoplankton-menu',
  data: {
    items: config.menu
  }
})

Vue.component('page-item', {
    props: ['section'],
    template: '<div class="phytoplankton-page__item"></div>',
    // data: {

    // },
    methods: {

    }
});

var section = new Vue({
  el: '.js-phytoplankton-page',
  data: {
    url: '',
    docs: '',
    css: '',
    blocks: []
  },
  methods: {
    loadFile: function() {
      this.docs = "Requesting ...";
      var rq = new XMLHttpRequest();

      rq.onreadystatechange = function(section) {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            var items = separate(this.responseText);
            section.docs = '';
            for (var i = 0, len = items.length; i < len; i++) {
              section.docs += items[i].docs;
              // console.log(items[i].css);
              var block = {
                docs: items[i].docs,
                css: items[i].css
              };
              section.blocks.push(block)
            };
            console.log(section.blocks);
            // console.log(section.docs);
            var tokens = marked.lexer(section.docs);
            var links = tokens.links || {};
            var block = {
              docs: [],
              css: []
            };

            for (var i = 0, len = tokens.length; i < len; i++) {
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
            section.docs = block.docs;
          } else {
            section.docs = '**Request Failed!**\n\n' +
                           'Either the file the extension *(.css, .stylus, .styl, .less, .sass, .scss)* in `config.menu.url` is missing or the file just doesn\'t exist.';
            section.docs = marked(section.docs);
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
    var pre = document.getElementsByTagName("pre");
    for (var i = 0, len = pre.length; i < len; i++) {
      pre[i].className = 'line-numbers';
    }
    Prism.highlightAll();
    Prism.fileHighlight();
    fixie.init();
  }
})

// Set first menu link's state to "active".
document.querySelectorAll('.js-phytoplankton-menu a')[0].classList.add('is-active');
// Set section URL to first menu item.
section.url = config.menu[0].url[0];
// Load first file.
section.loadFile();