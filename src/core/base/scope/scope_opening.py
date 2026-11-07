from collections.abc import Callable
from dataclasses import dataclass

from core.base.change.change import Change
from core.base.change.logged_event import LoggedEvent
from core.base.model.model import Model


@dataclass(frozen=True)
class ScopeOpening:
    """A scope that is disabled only for the events the function says True to."""

    scope: type
    passes: Callable[[LoggedEvent | Change[Model]], bool]
