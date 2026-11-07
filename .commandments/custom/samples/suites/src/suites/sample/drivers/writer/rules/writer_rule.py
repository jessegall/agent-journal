from core.base.driver.driver_rule import DriverRule


# @righteous architecture_layout_suite_rule_outside_rules
class WriterRule(DriverRule):
    name = "sample.writer-rule"
    drivers = ["sample.writer"]
