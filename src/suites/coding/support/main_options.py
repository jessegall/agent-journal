from dataclasses import dataclass

BUILDER = (True, True, False, True, True, False, True)
ORCHESTRATOR = (False, True, True, True, True, False, True)


@dataclass(frozen=True)
class MainOptions:
    """What the main agent may do in an environment: the seven workflow controls, where each was set, and what is
    wrong with a stored value. A control that holds something other than on or off reads as off until repaired."""

    auto: bool
    sends_workers: bool
    keeps_going: bool
    merger: bool
    helpers: bool
    designer: bool
    may_merge: bool
    sources: tuple[tuple[str, str], ...] = ()
    problems: tuple[str, ...] = ()

    @property
    def bundle(self) -> tuple[bool, ...]:
        return (self.auto, self.sends_workers, self.keeps_going, self.merger, self.helpers, self.designer, self.may_merge)

    @property
    def workflow(self) -> str:
        if self.problems:
            return "custom"
        if self.bundle == BUILDER:
            return "builder"
        return "orchestrator" if self.bundle == ORCHESTRATOR else "custom"
