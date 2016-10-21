@disable-bundler
Feature: Update doggystyle files

  Scenario: Updating updates an existing doggystyle install
    Given doggystyle is already installed
    When I write to "doggystyle/_doggystyle.scss" with:
      """
      foobar
      """
    And I run `bundle exec doggystyle update`
    Then the output should contain "Doggystyle files updated."
    And the file "doggystyle/_doggystyle.scss" should not contain "foobar"

  Scenario: Updating with a --path option
    Given I install doggystyle to "custom_path"
    When I write to "custom_path/doggystyle/_doggystyle.scss" with:
      """
      foobar
      """
    And I run `bundle exec doggystyle update`
    Then the output should contain "No existing doggystyle installation. Doing nothing."

    When I run `bundle exec doggystyle update --path custom_path`
    Then the output should contain "Doggystyle files updated."
    And the file "custom_path/doggystyle/_doggystyle.scss" should not contain "foobar"

  Scenario: Updating does not generate a new doggystyle install
    And I run `bundle exec doggystyle update`
    Then doggystyle should not have been generated
    And the output should contain "No existing doggystyle installation. Doing nothing."
