from dataclasses import dataclass

from journal.support.operation import Operation


@dataclass(frozen=True)
class SubagentDispatch(Operation):
    """The agent starting one of its program's own subagents: the kind of subagent, the model it runs on, its short title and its brief."""

    kind = "subagent dispatch"
    role: str
    model: str
    title: str
    brief: str
