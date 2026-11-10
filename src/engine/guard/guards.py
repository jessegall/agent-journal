from engine.change.change import Change
from engine.container.container import Container
from engine.guard.change_filter import ChangeFilter
from engine.listener.event_listeners import EventListeners
from engine.guard.guard import Guard
from engine.guard.guard_switches import GuardSwitches
from engine.guard.guard_refusal import GuardRefusal
from engine.model.model import Model
from engine.registry.guard_entry import GuardEntry
from engine.registry.listener_timing import ListenerTiming
from engine.registry.registry import Registry
from engine.errors.refusal import Refusal

LIFECYCLE_GUARD = "core.lifecycle"


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
            skipped.update(name for name in change.context.skipped_guards if name.startswith(f"{entry.name}:"))
            self.check(entry, change)
        return frozenset(skipped)

    def is_checked(self, entry: GuardEntry, change: Change[Model]) -> bool:
        if entry.name == LIFECYCLE_GUARD or entry.path.checked_class(Guard).is_safety:
            return True
        return entry.name not in change.context.skipped_guards and self.switches.enabled(entry.name) and self.change_filter.applies(entry.name, change)

    def check(self, entry: GuardEntry, change: Change[Model]) -> None:
        guard_class = entry.path.checked_class(Guard)
        try:
            self.container.get(guard_class).check(change.typed_event(guard_class), change.context)
        except Refusal as refusal:
            guard_refusal = GuardRefusal(entry.name, refusal, "" if entry.name == LIFECYCLE_GUARD or guard_class.is_safety else entry.skip_flag)
            if change.context.explanation is None:
                raise guard_refusal from refusal
            change.context.explanation.refusals.append(guard_refusal)
