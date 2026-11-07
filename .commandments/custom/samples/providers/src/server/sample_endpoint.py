from core.base.driver.hook_event import HookEvent


class SampleEndpoint:
    """An endpoint sample that names an agent program and a hook by their strings."""

    def is_claude_stop(self, event: HookEvent) -> bool:
        # @sin architecture_providers_program_name_compared_outside_its_provider
        return event.program == "claude"

    def is_stop(self, event: HookEvent) -> bool:
        # @sin architecture_providers_hook_compared_by_a_string
        return event.event == "stop"
