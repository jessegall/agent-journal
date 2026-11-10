from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.provider.managed_hooks import ManagedHooks
from core.modules.drivers.events.session_started import SessionStarted

GRAPHIFY_SEARCH_HOOKS = ("graphify hook-guard", "graphify hook-check")


class GraphifyHookRemovalListener(CommitListener[SessionStarted]):
    """Removes the search hooks an older Graphify install left, so the only reminder is the journal's own count."""

    name = "tools.graphify-hook-removal"

    def __init__(self, hooks: ManagedHooks) -> None:
        self.hooks = hooks

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        for command in GRAPHIFY_SEARCH_HOOKS:
            self.hooks.removed_commands(command)
