from typing import ClassVar

from journal.db.migration import Migration


class DelegatedTasks(Migration):
    """A task a worker holds, kept started under it before, is delegated: it is in the worker's hands, never the dispatching agent's task in hand."""

    number: ClassVar[int] = 39
    statements: ClassVar[tuple[str, ...]] = ("UPDATE tasks SET state = 'delegated' WHERE state = 'started' AND 'tasks:' || id IN (SELECT target FROM links WHERE kind = 'in_hand' AND source LIKE 'workers:%')",)
