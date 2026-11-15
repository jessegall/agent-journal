from engine.enums.hook_event_name import HookEventName

HOOK_LIMIT_SECONDS = 3.5
STOP_LIMIT_SECONDS = 20.0
AGENT_HOOK_LIMIT_SECONDS = 45.0


class HookLimits:
    """How long the server gives a hook before it answers without it: the main agent's hooks briefly, a stop
    and the hooks of other agents longer."""

    @staticmethod
    def seconds(is_main: bool, event: HookEventName | None) -> float:
        limit = HOOK_LIMIT_SECONDS if is_main else AGENT_HOOK_LIMIT_SECONDS
        return max(limit, STOP_LIMIT_SECONDS) if event is HookEventName.STOP else limit
