from engine.agent_machine.contracts.effect import Effect


class NoteHookEffect(Effect):
    # @sin architecture_drivers_hook_named_by_a_string
    events = ["stop"]

    def commands(self, view, record):
        return []
