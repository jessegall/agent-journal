from typing import TypedDict


class EventRowValues(TypedDict):
    """The columns of one row of the event log, as it is inserted."""

    actor_id: int
    environment_id: int | None
    row_id: int
    name: str
    row_table: str
    command: str
    cause_id: int | None
    skipped_guards: str
    data: str
    created_at: str
