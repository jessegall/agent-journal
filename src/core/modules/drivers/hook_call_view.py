from dataclasses import dataclass


@dataclass(frozen=True)
class HookCallView:
    """One hook call as journal hook-call show prints it: the hook and its answer, the layers that were active, each
    rule with its layer and outcome, and the moves dropped as second moves of one row."""

    id: int
    agent_id: int
    hook: str
    driver: str
    answer: str
    refusal: str
    lines: str
    layers: str
    rules: str
    dropped: str
