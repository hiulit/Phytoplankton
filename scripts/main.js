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
    docs: '',
    code: '',
    blocks: []
  },
  beforeCreate: function () {
    console.log('beforeCreate');
  },
  created: function () {
    console.log('created');
    $.ajax({
        url: 'main.styl',
        async: false,
        cache: true,
        success: function(data){
            allImports = findImports(data, 'http://localhost:8080/Phytoplankton/', 'styl');
        }
    });
  },
  beforeMount: function () {
    console.log('beforeMount');
  },
  mounted: function () {
    console.log('mounted');
    // // Set first menu link's state to "active".
    document.querySelectorAll('.js-phytoplankton-menu a')[0].classList.add('is-active');
    // // Set page URL to first menu item.
    this.url = config.menu[0].url[0];
    // // Load first file.
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

    // function createRepresentationFromHeadings(headings) {
    //     let i = 0;
    //     const tags = [];
        
    //     (function recurse(depth) {
    //         let unclosedLi = false;
    //         while (i < headings.length) {
    //             const [hashes, data] = headings[i].split("# ");
    //             if (hashes.length < depth) {
    //                 break;
    //             } else if (hashes.length === depth) {
    //                 if (unclosedLi) tags.push('</li>');
    //                 unclosedLi = true;
    //                 tags.push('<li>', data);
    //                 i++;
    //             } else {
    //                 tags.push('<ul>');
    //                 recurse(depth+1);
    //                 tags.push('</ul>');
    //             }
    //         }
    //         if (unclosedLi) tags.push('</li>');
    //     })(-1);
    //     return tags.join('\n');
    // }

    // var headings = [
    //     "# Getting Started",
    //     "# Heading 1",
    //     "## SubHeading 1",
    //     "## SubHeading 2",
    //     "### SubSubHeading 1",
    //     "### SubSubHeading 2",
    //     "#### SubSubSubHeading 1",
    //     "## SubHeading 3",
    // ];

    // var hola = createRepresentationFromHeadings(headings);
    // console.log(hola);

    // var headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    // console.log(headings);
    // function createMenu() {
    //   var i = 0;
    //   var submenu = document.createElement('ul');
    //   submenu.setAttribute('data-gumshoe', '');
    //   (function recurse(depth) {
    //     while(i < headings.length) {
    //       var hash = headings[i];
    //       hash = hash.tagName.split('H');
    //       hash = Number(hash[1]);
    //       var submenuItem = document.createElement('li');
    //       var submenuItemAnchor = document.createElement('a');
    //       submenuItem.appendChild(submenuItemAnchor);
    //       submenuItemAnchor.setAttribute('href', '#' + headings[i].id);
    //       submenuItemAnchor.setAttribute('data-scroll', '');
    //       submenuItemAnchor.appendChild(document.createTextNode(headings[i].textContent));
    //       if (hash > 1) {
    //         if (hash !== depth) {
    //           if (submenuList) {
    //             console.log(submenuList);
    //             var newSubmenuList = document.createElement('ul');
    //             newSubmenuList.appendChild(submenuItem);
    //             submenuList.lastChild.appendChild(newSubmenuList);
    //           } else {
    //             var submenuList = document.createElement('ul');
    //             submenuList.appendChild(submenuItem);
    //             submenu.lastChild.appendChild(submenuList);
    //             depth = hash;
    //           }
    //         } else {
    //           // console.log(submenuItem);
    //           submenuList.lastChild.parentNode.appendChild(submenuItem);
    //         }
    //       } else {
    //         depth = hash;
    //         submenu.appendChild(submenuItem);
    //         i++;
    //         recurse(hash);
    //       }
    //       i++
    //     }
    //   })(1);
    //   return submenu;
    // }
    // var menuCreated = createMenu(headings);

    //Initialize the root UL
    var ul = $('<ul data-gumshoe>');
    for(var i = 1; i < 8; i++){
        var hs = $('h' + i);
        if(hs.length){
            ul[0].childHeaders = hs
            ul[0].childHeaderLevel = i;
            break;
        }
    }

    var rootUl = ul;
    //main loop
    while(ul.length){    
        var nextUl = $();
        //loop through each ul
        ul.each(function(){
             var innerUl = this;
             var n = this.childHeaderLevel;
             //turn each childHeader into the corresponding ul
             innerUl.childHeaders.each(function(i,elem){
                var childUl = $('<ul>').append('<li>' + $(elem).html() + '</li>')
                                       .appendTo(innerUl);
                childUl[0].childHeaders = $(this).nextUntil('h' + n)
                                                 .filter('h' + (n+1));
                childUl[0].childHeaderLevel = n + 1;            
                nextUl = nextUl.add(childUl);
           });                            
        });
        ul = nextUl;   
    }

    $('[data-url="' + this.url + '"]').parent().append(rootUl);

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
      // var cssArray = [];

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

              var cleanCode = removeComments(blocks[i].code);
              if (cleanCode !== '') {
                block.code = computeCss(cleanCode);
              }
              // var parsedCSS = gonzales.parse(block.code);
              // parsedCSS = parsedCSS.content;
              // for (var k = 0, lengthCss = parsedCSS.length; k < lengthCss; k++) {
              //   if (parsedCSS[k].type === 'ruleset') {
              //     var ruleset = parsedCSS[k].toString();
              //     cssArray.push('.code-render ' + ruleset);
              //   }
              // }

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
            };

            // if (cssArray.length) {
            //   styles = document.createElement('style');
            //   for (var l = 0, lengthCssArray = cssArray.length; l < lengthCssArray; l++) {
            //     styles.appendChild(document.createTextNode(cssArray[l]));
            //   }
            //   document.head.appendChild(styles);
            // }
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
