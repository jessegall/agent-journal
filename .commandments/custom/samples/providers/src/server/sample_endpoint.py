from core.base.driver.hook_event import HookEvent


class SampleEndpoint:
    """An endpoint sample that names an agent program and a hook by their strings."""

    def is_claude_stop(self, event: HookEvent) -> bool:
        # @sin architecture_providers_ProgramNamesOnlyInProvidersDetector
        return event.program == "claude"

    def is_stop(self, event: HookEvent) -> bool:
        # @sin architecture_providers_HookNamesByMemberDetector
        return event.event == "stop"
