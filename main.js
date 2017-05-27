// var lala = separate('/* # adeu bon dia \n hola com va? \n > quote*/ \n .hola {color: red;}');
// var docs = lala[0].docs;
// var css = lala[0].code;

// var parse = gonzales.parse(css);

// console.log(parse);
// console.log(parse.toString());

// var file = 'readme.css';

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
  template: '<li>{{ menu.title }}<ul><li v-for="url in menu.url"><a v-bind:data-url="url" @click="goToFile">{{ url }}</a></li></ul></li>',
  // data: {

  // },
  methods: {
    goToFile: function(e) {
      // console.log(e.target.dataset.url);
      // section.url = this.menu.url;
      section.url = e.target.dataset.url;
      section.loadFile();
    }
  }
})

var menuList = [
  {
    title: "Phytoplankton Style Guide",
    url: [
      "readme.css"
    ]
  },
  {
    title: "Documentation",
    url: [
      "documentation.css"
    ]
  },
]

// To add new items -> menu.menuList.push({text: 'new item'})
var menu = new Vue({
  el: '.js-nav',
  data: {
    menuList: menuList
  }
})

var section = new Vue({
  el: '.js-section',
  data: {
    url: '',
    info: ''
  },
  methods: {
    loadFile: function() {
      this.info = "Requesting ...";
      var rq = new XMLHttpRequest();

      rq.onreadystatechange = function(section) {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            // console.log(section.url);
            // if(result === null) {
            //   return alert('You\'re missing the extension (.css, .stylus, .styl, .less, .sass, .scss) in the URL.');
            // }

            var items = separate(this.responseText);
            section.info = '';
            items.forEach(function(item, index, array) {
              section.info += item.docs;
            });

            // var tokens = marked.lexer(section.info);
            // var links = tokens.links || {};
            // var block = {
            //   content: []
            // };

            // for (var i = 0, len = tokens.length; i < len; i++) {
            //   switch (tokens[i].type) {
            //     case 'code':
            //       if (tokens[i].lang === 'markup') {
            //         block.content.push({
            //           type: 'html',
            //           lang: 'markup',
            //           text: '<div class="code-render clearfix">' + tokens[i].text + '</div>' +
            //               '<ul class="phytoplankton-tabs">' +
            //               '<li class="phytoplankton-tabs__item is-active">HTML</li>' +
            //               '</ul>'
            //         });
            //         console.log(block);
            //       }
            //     break;
            //     default:
            //       block.content.push(tokens[i]);
            //       // console.log(block);
            //     break;
            //   }
            // }
            // block.content.links = links;
            // // console.log(block);
            // block.content = marked.parser(block.content);
            // section.info = block.content;

          } else {
            section.info = 'Request Failed';
            section.info += ': You\'re missing the extension (.css, .stylus, .styl, .less, .sass, .scss) in menuList.'
          }
        }
      }.bind(rq, this);

      rq.open("GET", this.url);
      rq.send();
    }
  },
  computed: {
    compiledMarkdown: function() {
      // return this.info
      return marked(this.info, {
        sanitize: false,
        gfm: true,
        tables: true,
        langPrefix: 'language-'
      })
    }
  },
  updated: function() { // "onReady function"
    var pre = document.getElementsByTagName("pre");
    for (var i = 0, len = pre.length; i < len; i++) {
      pre[i].className = 'line-numbers';
    }
    Prism.highlightAll();
    Prism.fileHighlight();
  }
})

section.url = menuList[0].url[0];
section.loadFile();