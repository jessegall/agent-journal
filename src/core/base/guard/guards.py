from core.base.change.change import Change
from core.base.container import Container
from core.base.guard.change_filter import ChangeFilter
from core.base.guard.explanation import EventListeners
from core.base.guard.guard import Guard
from core.base.guard.guard_switches import GuardSwitches
from core.base.guard_refusal import GuardRefusal
from core.base.model.model import Model
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerTiming
from core.base.registry.registry import Registry
from core.base.refusal import Refusal

LIFECYCLE_GUARD = "core.lifecycle"


class GuardClassError(Exception):
    """Raised when a registered guard's path leads to a class that is not a guard."""


class Guards:
    """Asks every guard registered for a change's event, in their fixed order, and stops at the first refusal;
    with --explain it collects every refusal instead."""

    def __init__(self, registry: Registry, container: Container, switches: GuardSwitches, change_filter: ChangeFilter) -> None:
        self.registry, self.container, self.switches, self.change_filter = registry, container, switches, change_filter

    def ask(self, change: Change[Model]) -> frozenset[str]:
        explanation = change.context.explanation
        if explanation is not None:
            listeners = [entry.name for timing in ListenerTiming for entry in self.registry.event_listeners(change.event, timing)]
            explanation.events.append(EventListeners(change.event, listeners))
        skipped: set[str] = set()
        for entry in self.registry.event_guards(change.event):
            if not self.is_checked(entry, change):
                skipped.update({entry.name} & change.context.skipped_guards)
                continue
            self.check(entry, change)
        return frozenset(skipped)

    def is_checked(self, entry: GuardEntry, change: Change[Model]) -> bool:
        if entry.name == LIFECYCLE_GUARD:
            return True
        return entry.name not in change.context.skipped_guards and self.switches.enabled(entry.name) and self.change_filter.applies(entry.name, change)

    def check(self, entry: GuardEntry, change: Change[Model]) -> None:
        guard_class = entry.path.loaded()
        if not issubclass(guard_class, Guard):
            raise GuardClassError(f"{entry.path.text} is no guard")
        try:
            self.container.get(guard_class).check(change)
        except Refusal as refusal:
            guard_refusal = GuardRefusal(entry.name, refusal, "" if entry.name == LIFECYCLE_GUARD else entry.skip_flag)
            if change.context.explanation is None:
                raise guard_refusal from refusal
            change.context.explanation.refusals.append(guard_refusal)
