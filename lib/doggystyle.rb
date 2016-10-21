require "doggystyle/generator"

doggystyle_path = File.expand_path("../../core", __FILE__)
ENV["SASS_PATH"] = [
  ENV["SASS_PATH"],
  doggystyle_path,
].compact.join(File::PATH_SEPARATOR)
