# Phytoplankton - Living Style Guide

> This is a Vue.js port of [Phytoplankton - Living Style Guide](https://github.com/hiulit/kaleistyleguide) which is a fork of [Kalei - Style Guide](https://github.com/thomasdavis/kaleistyleguide). It's an alpha version, although it's kind of functional. Not officially released to the public.

Generate a living style guide with your own CSS!

This project aims at making sure your style sheets are fully documented whilst being synchronized with your project styles.

To do this, it actually uses your style sheets so that, at anytime, you can review how your style guide looks.

## Main goals and benefits

* Fully documented CSS - No need to explain the benefits.
* No dependencies, simply download the repository and run it in your browser.
* Automatic generation of demo UI components.
* Easy access for anyone: designers, developers, managers, users, etc.
* Rapid development of projects by allowing developers to find the correct CSS and HTML for any given UI component.
* Open sourced so that all great ideas can be included.

## Installation

**No** Node.js, **no** Grunt, **no** Gulp, **no** nothing...

Just:

1. [Download](https://github.com/hiulit/kaleistyleguide) the repository or `git clone https://github.com/hiulit/kaleistyleguide.git`
2. Serve it on a HTTP server (or a local environment using [MAMP](http://www.mamp.info/),
 [XAMPP](http://www.apachefriends.org/), etc.)
3. And it should work! 😀

## Prepocessors support

* ~~[Sass](http://sass-lang.com/) ([libsass v3.1.0](https://github.com/sass/libsass/releases/tag/3.1.0))~~
* ~~[Less](http://lesscss.org/) ([v2.5.1](https://github.com/less/less.js/releases/tag/v2.5.1))~~
* ~~[Stylus](http://stylus-lang.com/) ([v0.54.5](https://github.com/stylus/stylus/releases/tag/0.54.5))~~

### Notes

Why don't you use the [latest version of Sass](http://sass-lang.com/documentation/file.SASS_CHANGELOG.html)?

Phytoplankton uses [sass.js](https://github.com/medialize/sass.js) for having Sass in the browser
([not a trivial task](http://blog.rodneyrehm.de/archives/33-libsass.js-An-Emscripten-Experiment.html), btw)
which in turn uses [libsass](https://github.com/hcatlin/libsass).

**Update 1**: Here it is the the [State of Libsass (versus Ruby Sass)](http://www.solitr.com/blog/2014/01/state-of-libsass/).

**Update 2**: Here it is [The LibSass Compatibility Plan](https://github.com/sass/libsass/wiki/The-LibSass-Compatibility-Plan).

*It seems that finally, thanks to the effort of a lot of people, libsass will reach parity with Ruby Sass*.

## Browser support

|               | IE9       | IE10+     | Firefox   | Chrome    | Opera     |
| :--           | :-:       | :-:       | :-:       | :-:       | :-:       |
| CSS           | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  |
| Sass          | &#x2717;  | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  |
| Less          | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  |
| Stylus        | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  |
| Handlebars    | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  |
| Prism         | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  | &#x2713;  |

Not tested on Safari.

## Changelog

### Unreleased

* Not officially released.

## To do

* ~~Handlebars temaplates path configurable.~~
* ~~Handlebars context and helpers paths configurable.~~
* ~~Upgrade to Less 2.0.0 and above.~~
* ~~Add styles tab name dynamically (scss, less, etc).~~
* ~~Create tooltips (for ZeroClipboard).~~
* ~~Fix tooltips overflow issue.~~
* ~~Fix tabs scroll.~~
* Improve tabs system.
* Fix issue with Prism's File Highlight plugin async loading causing Gumshoe (e.g. <pre data-src="") not to work properly.
* ~~RequireJS & Backbone optimization (separate modules, create components, etc.).~~
* Add a view for showing colors, images (galleries, etc.).
* Add loading state in pages.
* Need **help** updating [sass.js](https://github.com/medialize/sass.js) to the latest version.

## Inspiration and alternatives

Phytoplankton is heavily influenced by the projects found in [http://styleguides.io/](http://styleguides.io/) and [the Style Guide guide](http://vinspee.me/style-guide-guide/).

## Technologies

Mad propz to all the great people behind the software listed below.

* [Vue](https://vuejs.org/) - Intuitive, Fast and Composable MVVM for building interactive interfaces.
* ~~[RequireJS](http://requirejs.org/) - JavaScript file and module loader.~~
* ~~[Backbone.js](http://backbonejs.org/) - Gives structure to web applications by providing models, collections and views.~~
* ~~[Underscore.js](http://underscorejs.org/) - JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects.~~
* ~~[Handlebars.js](http://handlebarsjs.com/) - Minimal templating on steroids.~~
* ~~[jQuery](http://jquery.com) - Fast, small, and feature-rich JavaScript library.~~
* [marked](https://github.com/chjj/marked) - Full-featured markdown parser and compiler in Javascript.
* ~~[gonzales](https://github.com/css/gonzales) - Fast CSS parser.~~
* [gonzales-pe](https://github.com/tonyganch/gonzales-pe) - CSS parser with support of preprocessors.
* ~~[sass.js](https://github.com/medialize/sass.js) - API for emscripted libsass to run in the browser.~~
* ~~[Less](http://lesscss.org/) - CSS pre-prepocessor.~~
* [Prism](http://prismjs.com/) - Lightweight, robust, elegant syntax highlighting.
* [Fixie.js](https://github.com/hiulit/fixie) - Automatically add filler content to HTML documents (featuring the awesome [VeganIpsum - All filler, no killer](http://bengreen.org.uk/veganipsum/)).
* [Gumshoe](https://github.com/cferdinandi/gumshoe) - A simple, framework-agnostic scrollspy script.
* [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll) - A simple vanilla JS script to animate scrolling to anchor links.

### Extras

* ~~[Sassy-Gridlover](https://github.com/hiulit/Sassy-Gridlover) - Super easy to use Sass mixins to establish a typographic system with modular scale and vertical rhythm.~~
* ~~[Sass Vegan Burger](https://github.com/hiulit/sass-burger) - A Sass mixin for creating (100% vegan) hamburger icons.~~
* ~~[Stacktable](https://github.com/johnpolacek/stacktable.js) - jQuery plugin for stacking tables on small screens.~~
* ~~[clipboard.js](https://github.com/zenorocha/clipboard.js) - Modern copy to clipboard. No Flash. Just 3kb gzipped.~~
* [Material Palette](http://www.materialpalette.com/teal/green) - Material design color palette generator.

## Author

* [Xavier Gómez Gosálbez](https://github.com/hiulit) ([@hiulit](https://twitter.com/hiulit)).

## Contributors

Mad propz to this guy:

* [Oriol Torras](https://github.com/otorras) ([@uriusfurius](https://twitter.com/uriusfurius)) for helping with [sass.js](https://github.com/medialize/sass.js).

## Credits

* [Thomas Davis](http://thomasdavis.github.com) - For creating the amazing [Kalei - Living Style Guide](https://github.com/thomasdavis/kaleistyleguide). Phytoplankton is a highly modified fork of this project, but a fork nonetheless.
* [Jacob Rask](https://github.com/jacobrask) - For creating the amazing [StyleDocco](https://github.com/jacobrask/styledocco). And also for open sourcing the project and letting me (and surely others) be able to implement some of his ideas, critical to Phytoplankton.

## License

MIT License

Copyright (c) 2017 Xavier Gómez Gosálbez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.