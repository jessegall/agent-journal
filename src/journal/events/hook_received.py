from dataclasses import dataclass

from journal.events.event import Event
from journal.hooks.hook import Hook


@dataclass(frozen=True)
class HookReceived(Event):
    """The agent reported a hook; listeners answer with a Decision each, and the receiver folds them."""

    hook: Hook
