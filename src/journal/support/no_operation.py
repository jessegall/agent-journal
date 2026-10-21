from dataclasses import dataclass

from journal.support.operation import Operation


@dataclass(frozen=True)
class NoOperation(Operation):
    """The operation of an entry that records no call: one that is no tool call, or one written before calls were recorded."""

    kind = ""
