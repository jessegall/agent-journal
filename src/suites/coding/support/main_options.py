from dataclasses import dataclass

BUILDER = (True, True, False, True, True, False, True, True)
ORCHESTRATOR = (False, True, True, True, True, False, True, False)
PRESETS = {"builder": BUILDER, "orchestrator": ORCHESTRATOR}
PRESET_LINES = {"builder": "The main agent writes code itself and sends workers for the rest.", "orchestrator": "The main agent plans, sends workers and merges their work, and writes no code itself."}


@dataclass(frozen=True)
class MainOptions:
    """What the main agent may do in an environment: the eight workflow controls, where each was set, and what
    is wrong with a stored value. A control that holds something other than on or off reads as off until
    repaired."""

    auto: bool
    sends_workers: bool
    continues_work: bool
    merger: bool
    helpers: bool
    designer: bool
    may_merge: bool
    writes_code: bool
    sources: tuple[tuple[str, str], ...] = ()
    problems: tuple[str, ...] = ()

    @property
    def bundle(self) -> tuple[bool, ...]:
        return (self.auto, self.sends_workers, self.continues_work, self.merger, self.helpers, self.designer, self.may_merge, self.writes_code)

    @property
    def workflow(self) -> str:
        if self.problems:
            return "custom"
        if self.bundle == BUILDER:
            return "builder"
        return "orchestrator" if self.bundle == ORCHESTRATOR else "custom"
