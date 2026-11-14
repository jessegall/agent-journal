from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName


class NoteMemberRule(DriverRule):
    name = "notes.note-member"
    # @righteous architecture_drivers_hook_named_by_a_string
    hook = HookEventName.STOP
