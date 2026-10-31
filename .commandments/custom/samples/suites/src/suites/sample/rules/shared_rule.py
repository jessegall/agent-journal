from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName


# @righteous architecture_suites_SharedRulesNameNoDriversDetector
class SharedRule(DriverRule):
    name = "sample.shared"
    hook = HookEventName.STOP
