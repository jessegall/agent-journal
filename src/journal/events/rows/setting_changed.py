from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class SettingChanged(RowEvent):
    """A setting's value was written, named by its setting key."""

    setting: str
