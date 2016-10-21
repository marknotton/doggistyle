$:.push File.expand_path("../lib", __FILE__)
require "doggystyle/version"

Gem::Specification.new do |s|
  s.add_development_dependency "aruba", "~> 0.6.2"
  s.add_development_dependency "css_parser", "~> 1.4.1"
  s.add_development_dependency "rake", "~> 11.1.2"
  s.add_development_dependency "rspec", "~> 3.4.0"
  s.add_development_dependency "scss_lint", "0.48.0"
  s.add_runtime_dependency "sass", "~> 3.4.22"
  s.add_runtime_dependency "thor", "~> 0.19.1"
  s.authors = "Mark Notton"
  s.description = <<-DESC
    A collection of Sass resources found from an array of sources, forums, and tutorials.
    Many of my own mixins and functions have been writen to take advantage of
    Sass lists and maps, allowing users to enter settings without strict ordering.
  DESC
  s.email = "mark@marknotton.uk"
  s.executables = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.files = `git ls-files`.split("\n")
  s.homepage = "http://doggystyle.io"
  s.license = "MIT"
  s.name = "doggystyle"
  s.platform = Gem::Platform::RUBY
  s.require_paths = ["lib"]
  s.summary = "A collection of Sass resources found from an array of sources, forums, and tutorials."
  s.test_files = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.version = Doggystyle::VERSION
end
