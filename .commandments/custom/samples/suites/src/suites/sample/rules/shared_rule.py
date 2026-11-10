from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName


# @righteous architecture_layout_suite_driver_rule_in_shared_rules
class SharedRule(DriverRule):
    name = "sample.shared"
    hook = HookEventName.STOP
