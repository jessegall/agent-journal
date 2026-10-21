from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class RuleMade(RowEvent):
    """A rule was written, by the agent or by the user."""

    agent_origin: bool
