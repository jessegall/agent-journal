from dataclasses import dataclass

from journal.models.node import Node
from journal.models.node_kind import NodeKind


QUIET = ("type", "show_card", "start_sequence")
"""The actions that neither change the hook's answer nor move the agent: a workflow of these alone walks after the reply."""


@dataclass(frozen=True)
class Graph:
    """A workflow compiled for walking: its nodes by number, the nodes each line leads to by node and port, and its triggers by the event they are on; built once from the rows and kept until the workflow changes."""

    nodes: dict[int, Node]
    after: dict[tuple[int, str], tuple[int, ...]]
    triggers: dict[str, tuple[int, ...]]
    answers: bool = True
    """Whether a step of it can change the hook's answer or the agent's state, so it walks before the reply; one that only types or shows a card walks after it."""

    @classmethod
    def of(cls, nodes: list[Node], lines: list) -> "Graph":
        after: dict[tuple[int, str], list[int]] = {}
        for line in lines:
            after.setdefault((line.source.id, line.kind), []).append(line.target.id)
        triggers: dict[str, list[int]] = {}
        for node in nodes:
            if node.kind == NodeKind.TRIGGER:
                triggers.setdefault(node.key, []).append(node.id)
        answers = any(node.kind == NodeKind.ACTION and node.key not in QUIET for node in nodes)
        return cls({node.id: node for node in nodes}, {k: tuple(v) for k, v in after.items()}, {k: tuple(v) for k, v in triggers.items()}, answers)
