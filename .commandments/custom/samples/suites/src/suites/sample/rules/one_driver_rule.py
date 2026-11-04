from core.base.driver.driver_rule import DriverRule


# @sin architecture_layout_suite_driver_rule_in_shared_rules
class OneDriverRule(DriverRule):
    name = "sample.one-driver"
    drivers = ["sample.writer"]
