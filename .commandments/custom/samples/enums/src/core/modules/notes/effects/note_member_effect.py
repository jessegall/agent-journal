from engine.agent_state_machine.contracts.effect import Effect
from engine.enums.hook_event_name import HookEventName


class NoteMemberEffect(Effect):
    # @righteous architecture_drivers_hook_named_by_a_string
    events = [HookEventName.STOP]

    def commands(self, view, record):
        return []
