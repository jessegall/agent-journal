from core.base.driver.driver_rule import DriverRule


# @righteous architecture_layout_RulesInRulesFoldersDetector
class WriterRule(DriverRule):
    name = "sample.writer-rule"
    drivers = ["sample.writer"]
