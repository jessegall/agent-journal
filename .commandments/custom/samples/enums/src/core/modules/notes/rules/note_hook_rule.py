from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName


class NoteHookRule(DriverRule):
    name = "notes.note-hook"
    # @sin architecture_drivers_hook_named_by_a_string
    hook = "stop"
