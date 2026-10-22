from journal.events.listener import Listener
from journal.events.models.synced import Synced
from journal.models.setting import Setting
from journal.repositories.setting_rows import SettingRows


class PulledSettings(Listener[Synced]):
    """A setting another machine changed clears this machine's cache of settings, which a pulled write does not go through."""

    def __init__(self, settings: SettingRows) -> None:
        self.settings = settings

    def handle(self, event: Synced) -> None:
        if isinstance(event.model, Setting):
            self.settings.stored()
