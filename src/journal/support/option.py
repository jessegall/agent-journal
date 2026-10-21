from dataclasses import dataclass

from journal.support.wrong_setting_kind import WrongSettingKind


@dataclass(frozen=True)
class Option:
    """A setting a feature reads, declared once: its key as feature.name, the words the settings page shows, its default and its kind."""

    key: str
    title: str
    abstract: str
    default: object
    kind: str = "number"
    unit: str = ""
    choices: tuple[str, ...] = ()
    provider: str = ""

    def integer(self, value: object) -> int:
        if not isinstance(value, (int, float, str)):
            raise WrongSettingKind(self.key, value)
        return int(value)

    def decimal(self, value: object) -> float:
        if not isinstance(value, (int, float, str)):
            raise WrongSettingKind(self.key, value)
        return float(value)

    def texts(self, value: object) -> tuple[str, ...]:
        if not isinstance(value, (list, tuple)):
            raise WrongSettingKind(self.key, value)
        return tuple(str(item) for item in value)

    @property
    def feature(self) -> str:
        return self.key.split(".", 1)[0]

    @property
    def name(self) -> str:
        return self.key.split(".", 1)[1]
