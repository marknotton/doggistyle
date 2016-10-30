<img src="http://i.imgur.com/DrR97Jt.png" alt="Doggy Style" height="150" />

# Doggy Style [![GitHub release](https://img.shields.io/github/release/marknotton/doggystyle.svg)](https://github.com/marknotton/doggystyle/releases)

A collection of Sass resources found from an array of sources, forums, and tutorials. Many of my own mixins and functions have been writen to take advantage of Sass lists and maps, allowing users to enter settings without strict ordering.

- **[Changelog](https://github.com/marknotton/doggystyle/releases)**
- **[Issues & Bugs](https://github.com/marknotton/doggystyle/issues)**

## Requirements

- [Sass](https://github.com/sass/sass) 3.4+ or [LibSass](https://github.com/sass/libsass) 3.3+

## Installation

1. Install the Doggy Style gem using the [RubyGems](https://rubygems.org) package manager:

  ```bash
  gem install doggystyle
  ```

  Alternatively, you can install Doggy Style with [Bower](http://bower.io).

1. Install the Doggy Style library into the current directory:

  ```bash
  doggystyle install
  ```

  **Pro Tip:** You can target installation into a specific directory using the `path` flag:

  ```bash
  doggystyle install --path sass/
  ```

1. Import Doggy Style at the beginning of your stylesheet:

  ```scss
  @import "doggystyle/_import";
  ```

  It’s not recommended to add or modify the Doggy Style files so that you can update them easily.


## Thanks

A special thank you to the talented people at [thoughtbot, inc.](https://thoughtbot.com/) for keeping their prodcts open source; and allowing me the opportunity to learn, adapt and publish my own gem.
