from dataclasses import dataclass


@dataclass(frozen=True)
class HookCallView:
    """One hook call as journal hook-call show prints it: the hook, the suite and driver that answered it, its
    answer, the layers that were active, each rule with its outcome, and the moves dropped as second moves of
    one row."""

    id: int
    agent_id: int
    hook: str
    suite: str
    driver: str
    answer: str
    refusal: str
    lines: str
    layers: str
    rules: str
    dropped: str
