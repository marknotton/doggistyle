require "doggystyle/version"
require "fileutils"
require "thor"
require "pathname"

module Doggystyle
  class Generator < Thor
    map ["-v", "--version"] => :version

    desc "install", "Install Doggystyle into your project"
    method_options :path => :string, :force => :boolean
    def install
      if doggystyle_files_already_exist? && !options[:force]
        puts "Doggystyle files already installed, doing nothing."
      else
        install_files
        puts "Doggystyle files installed to #{install_path}/"
      end
    end

    desc "update", "Update Doggystyle"
    method_options :path => :string
    def update
      if doggystyle_files_already_exist?
        remove_doggystyle_directory
        install_files
        puts "Doggystyle files updated."
      else
        puts "No existing doggystyle installation. Doing nothing."
      end
    end

    desc "version", "Show Doggystyle version"
    def version
      say "Doggystyle #{Doggystyle::VERSION}"
    end

    private

    def doggystyle_files_already_exist?
      install_path.exist?
    end

    def install_path
      @install_path ||= if options[:path]
          Pathname.new(File.join(options[:path], "doggystyle"))
        else
          Pathname.new("doggystyle")
        end
    end

    def install_files
      make_install_directory
      copy_in_scss_files
    end

    def remove_doggystyle_directory
      FileUtils.rm_rf("doggystyle")
    end

    def make_install_directory
      FileUtils.mkdir_p(install_path)
    end

    def copy_in_scss_files
      FileUtils.cp_r(all_stylesheets, install_path)
    end

    def all_stylesheets
      Dir["#{stylesheets_directory}/*"]
    end

    def stylesheets_directory
      File.join(top_level_directory, "core")
    end

    def top_level_directory
      File.dirname(File.dirname(File.dirname(__FILE__)))
    end
  end
end
