from collections.abc import Callable

from engine.event.change import Change
from engine.event.logged_event import LoggedEvent
from engine.model.model import Model
from engine.scope.scope_opening import ScopeOpening


class Scope:
    """Something always active that keeps rows from a reader. A listener, handler, rule or read that may pass it
    names it in disabled_scopes; the scope itself lists no exceptions."""

    @classmethod
    def when(cls, passes: Callable[[LoggedEvent | Change[Model]], bool]) -> ScopeOpening:
        return ScopeOpening(cls, passes)
