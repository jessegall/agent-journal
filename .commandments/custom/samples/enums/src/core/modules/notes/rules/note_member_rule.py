from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName


class NoteMemberRule(DriverRule):
    name = "notes.note-member"
    # @righteous architecture_drivers_HookByMemberDetector
    hook = HookEventName.STOP
