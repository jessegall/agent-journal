from dataclasses import dataclass

from journal.events.rows.setting_changed import SettingChanged
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Setting(Scoped):
    """One key with a JSON value. environment_id 0 is the project's, laid over every environment's own."""

    key: str = ""
    value: object | None = None

    def set_to(self, value: object, at: float) -> "Setting":
        return self.with_(value=value).with_event(SettingChanged(environment_id=self.environment_id, at=at, setting=self.key))
