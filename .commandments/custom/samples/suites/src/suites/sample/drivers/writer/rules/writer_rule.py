from core.base.driver.driver_rule import DriverRule


# @righteous architecture_suites_RulesInRulesFoldersDetector
class WriterRule(DriverRule):
    name = "sample.writer-rule"
    drivers = ["sample.writer"]
