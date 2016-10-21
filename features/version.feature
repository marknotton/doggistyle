@disable-bundler
Feature: Show version
  Scenario: Viewing version
    When I successfully run `bundle exec doggystyle --version`
    Then the output should contain the current version of Doggystyle
