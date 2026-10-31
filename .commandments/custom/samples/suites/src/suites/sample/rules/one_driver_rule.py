from core.base.driver.driver_rule import DriverRule


# @sin architecture_layout_SharedRulesNameNoDriversDetector
class OneDriverRule(DriverRule):
    name = "sample.one-driver"
    drivers = ["sample.writer"]
