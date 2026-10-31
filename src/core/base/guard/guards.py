from core.base.change.change import Change
from core.base.container import Container
from core.base.guard.applicability import Applicability
from core.base.guard.guard import Guard
from core.base.guard.guard_switches import GuardSwitches
from core.base.guard_refusal import GuardRefusal
from core.base.model.model import Model
from core.base.module.guard_entry import GuardEntry
from core.base.module.registry import Registry
from core.base.refusal import Refusal

LIFECYCLE_GUARD = "core.lifecycle"


class GuardClassError(Exception):
    """Raised when a registered guard's path leads to a class that is not a guard."""


class Guards:
    """Asks every guard registered for a change's event, in their fixed order, and stops at the first refusal."""

    def __init__(self, registry: Registry, container: Container, switches: GuardSwitches, applicability: Applicability) -> None:
        self.registry, self.container, self.switches, self.applicability = registry, container, switches, applicability

    def ask(self, change: Change[Model]) -> frozenset[str]:
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
        return entry.name not in change.context.skipped_guards and self.switches.is_on(entry.name) and self.applicability.applies(entry.name, change)

    def check(self, entry: GuardEntry, change: Change[Model]) -> None:
        guard_class = entry.path.loaded()
        if not issubclass(guard_class, Guard):
            raise GuardClassError(f"{entry.path.text} is no guard")
        try:
            self.container.get(guard_class).check(change)
        except Refusal as refusal:
            raise GuardRefusal(entry.name, refusal, "" if entry.name == LIFECYCLE_GUARD else entry.skip_flag) from refusal
