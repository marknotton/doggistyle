Given /^doggystyle is already installed$/ do
  install_doggystyle
end

Given /^I install doggystyle to "([^"]*)"$/ do |path|
end

Then /^the sass directories(?: with "([^"]+)" prefix)? should have been generated$/ do |prefix|
  sass_directories = [
    "animations",
    "functions",
    "helpers",
    "mixins",
    "placeholders",
    "settings"
  ]
  sass_directories.map!{ |directory| doggystyle_path(prefix, directory) }
  check_directory_presence(sass_directories, true)
end

Then /^the master doggystyle partial should have been generated(?: within "([^"]+)" directory)?$/ do |prefix|
  check_file_presence([doggystyle_path(prefix, '_import.scss')], true)
end

Then /^doggystyle should not have been generated$/ do
  check_directory_presence(['doggystyle'], false)
end

Then /^the output should contain the current version of Doggystyle$/ do
  assert_exact_output("Doggystyle #{Bourbon::VERSION}\n", all_output)
end
