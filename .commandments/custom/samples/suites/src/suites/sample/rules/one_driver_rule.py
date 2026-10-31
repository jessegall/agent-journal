from core.base.driver.driver_rule import DriverRule


# @sin architecture_suites_SharedRulesNameNoDriversDetector
class OneDriverRule(DriverRule):
    name = "sample.one-driver"
    drivers = ["sample.writer"]
