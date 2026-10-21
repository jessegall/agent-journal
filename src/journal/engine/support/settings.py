from dataclasses import dataclass

from journal.repositories.setting_rows import SettingRows
from journal.support.option import Option


@dataclass(frozen=True)
class Settings:
    """The values of the options the user set, frozen when the state machine takes them; a state reads one by the feature's option."""

    values: dict[str, object]

    @classmethod
    def applied(cls, rows: SettingRows, options: list[Option]) -> "Settings":
        return cls({option.key: rows.option(option) for option in options})

    def value(self, option: Option) -> object:
        return self.values[option.key]
