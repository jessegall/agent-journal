import json
import sqlite3
from collections.abc import Mapping
from dataclasses import dataclass
from types import MappingProxyType

from core.base.moment import Moment


@dataclass(frozen=True)
class LoggedEvent:
    """One change as the event log recorded it."""

    id: int
    event: str
    row_table: str
    row_id: int
    environment_id: int | None
    actor_id: int
    command: str
    cause_id: int | None
    skipped_guards: frozenset[str]
    moment: Moment
    data: Mapping[str, tuple[object, object]]

    @classmethod
    def parsed(cls, row: sqlite3.Row) -> "LoggedEvent":
        return cls(id=row["id"], event=row["name"], row_table=row["row_table"], row_id=row["row_id"], environment_id=row["environment_id"],
                   actor_id=row["actor_id"], command=row["command"], cause_id=row["cause_id"], skipped_guards=frozenset(json.loads(row["skipped_guards"])),
                   moment=Moment.parsed(row["created_at"]), data=MappingProxyType({key: tuple(pair) for key, pair in json.loads(row["data"]).items()}))
