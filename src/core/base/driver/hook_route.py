from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_reply import HookReply


class HookRoute:
    """How the journal answers a hook; with no drivers module installed, every hook is let through."""

    def answer(self, event: HookEvent) -> HookReply:
        return HookReply.let_through()
