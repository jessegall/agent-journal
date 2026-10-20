from journal.events.models.saved import Saved
from journal.events.listener import Listener
from journal.models.entry import Entry
from journal.repositories.entries import Entries
from journal.repositories.setting_rows import SettingRows


class TrimTheRecord(Listener[Saved]):
    """Every entry written trims the record to its newest entries, as many as the setting keeps; the file gives the space back by itself."""

    def __init__(self, entries: Entries, settings: SettingRows) -> None:
        self.entries, self.settings = entries, settings

    def handle(self, event: Saved) -> None:
        from journal.features.record.feature import Record
        if not isinstance(event.model, Entry):
            return
        self.entries.trim(event.model.id, int(self.settings.option(Record.KEPT)))
