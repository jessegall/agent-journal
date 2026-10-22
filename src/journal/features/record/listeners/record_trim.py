from journal.engine.nudger import NUDGE
from journal.events.models.saved import Saved
from journal.events.listener import Listener
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.repositories.setting_rows import SettingRows


class RecordTrim(Listener[Saved]):
    """Every entry written trims the record to its newest entries, as many as the setting keeps; the lines said to the agents are kept apart, as many of their own newest, since whether a line is said again is read from them and a flood of row changes must not make the journal forget it said one; the file gives the space back by itself."""

    def __init__(self, entries: Entries, settings: SettingRows) -> None:
        self.entries, self.settings = entries, settings

    def handle(self, event: Saved) -> None:
        from journal.features.record.feature import Record
        if not isinstance(event.model, Entry):
            return
        stored = self.settings.integer(Record.RECORD_LENGTH)
        if event.model.kind == NUDGE:
            self.entries.trim_lines(stored)
            return
        self.entries.trim(event.model.row_id, stored)
