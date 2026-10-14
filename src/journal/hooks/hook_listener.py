from typing import ClassVar

from journal.events.hook_received import HookReceived
from journal.features.listener import Listener
from journal.hooks.decision import Decision


class HookListener(Listener[HookReceived]):
    """A feature's handler for one hook. Deferred by default: the server replies first and runs it after. A handler that must answer the agent before it goes on says so with blocking = True, and only then does its decision reach the agent."""

    blocking: ClassVar[bool] = False

    def handle(self, event: HookReceived) -> Decision | None: ...
