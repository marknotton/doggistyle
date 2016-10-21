@disable-bundler
Feature: Install doggystyle files

  Scenario: Doggystyle generates a new doggystyle installation
    When I run `bundle exec doggystyle install`
    Then the sass directories should have been generated
    And the following directories should exist:
      | doggystyle     |
    And the master doggystyle partial should have been generated
    And the output should contain "Doggystyle files installed to doggystyle/"

  Scenario: Generating does not overwrite an existing doggystyle directory
    Given doggystyle is already installed
    When I run `bundle exec doggystyle install`
    Then the output should contain "Doggystyle files already installed, doing nothing."

  Scenario: Install Doggystyle into a custom path
    When I run `bundle exec doggystyle install --path=custom_path`
    Then the sass directories with "custom_path" prefix should have been generated
    And the following directories should exist:
      | custom_path/doggystyle     |
    And the master doggystyle partial should have been generated within "custom_path" directory
    And the output should contain "Doggystyle files installed to custom_path/doggystyle/"

  Scenario: Forcing install of doggystyle
    Given doggystyle is already installed
    When I run `bundle exec doggystyle install --force`
    Then the output from "bundle exec doggystyle install --force" should contain "Doggystyle files installed to doggystyle/"
    And the output should not contain "Doggystyle files already installed, doing nothing."
