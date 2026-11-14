from collections.abc import Callable
from dataclasses import dataclass
from typing import TYPE_CHECKING

from engine.event.change import Change
from engine.event.logged_event import LoggedEvent
from engine.model.model import Model

if TYPE_CHECKING:
    from engine.scope.scope import Scope


@dataclass(frozen=True)
class ScopeOpening:
    """A scope that is disabled only for the events the function says True to."""

    scope: "type[Scope]"
    passes: Callable[[LoggedEvent | Change[Model]], bool]
