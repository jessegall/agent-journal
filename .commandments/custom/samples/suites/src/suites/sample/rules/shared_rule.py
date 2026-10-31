from core.base.driver.driver_rule import DriverRule


# @righteous architecture_suites_SharedRulesNameNoDriversDetector
class SharedRule(DriverRule):
    name = "sample.shared"
    hook = "stop"
