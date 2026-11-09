from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.provider.managed_hooks import ManagedHooks
from core.modules.drivers.events.session_started import SessionStarted

GRAPHIFY_SEARCH_HOOK = "graphify hook-guard"


class GraphifyHookRemovalListener(CommitListener[SessionStarted]):
    """Removes the search hook an older Graphify install left, so the only reminder is the journal's own count."""

    name = "tools.graphify-hook-removal"

    def __init__(self, hooks: ManagedHooks) -> None:
        self.hooks = hooks

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        self.hooks.removed_commands(GRAPHIFY_SEARCH_HOOK)
