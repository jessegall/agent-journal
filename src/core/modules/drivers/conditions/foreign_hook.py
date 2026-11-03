from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.module.driver_entries import DRIVERS_MODULE


@dataclass(frozen=True)
class ForeignHook:
    """Matches hook calls that recorded a run of the requested project hook."""

    hook_id: str

    def statement(self) -> Statement:
        return Statement("EXISTS (SELECT 1 FROM json_each(metadata, ?) AS foreign_run WHERE json_extract(foreign_run.value, '$.id') = ?)",
                         [f'$."{DRIVERS_MODULE}".foreign', self.hook_id])
