from dataclasses import dataclass

from journal.support.rejection import Rejection
from journal.support.wrong_setting_kind import WrongSettingKind
from journal.support.option_scope import OptionScope

USER = "user"
AGENT = "agent"
SWITCH_VALUES = {"on": True, "true": True, "yes": True, "1": True, "off": False, "false": False, "no": False, "0": False}


@dataclass(frozen=True)
class Option:
    """A setting a feature reads, declared once: its key as feature.name, the words the settings page shows, its default, its kind, who may set it from the command line, the user alone or the agent too, and whether a shared journal shares it with the team or keeps it to one machine or one person."""

    key: str
    title: str
    abstract: str
    default: object
    kind: str = "number"
    unit: str = ""
    choices: tuple[str, ...] = ()
    provider: str = ""
    setter: str = USER
    scope: OptionScope = OptionScope.TEAM

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

    def parsed(self, text: str) -> object:
        if self.kind == "switch":
            if text.lower() not in SWITCH_VALUES:
                raise Rejection(f"{self.key} is on or off: say on or off")
            return SWITCH_VALUES[text.lower()]
        if self.kind == "choice" and text not in self.choices:
            raise Rejection(f"{self.key} is one of {', '.join(self.choices)}")
        if self.kind == "lines":
            return [line for line in text.split("\n") if line.strip()]
        if self.kind == "number":
            return self.number(text)
        return text

    def number(self, text: str) -> float | int:
        try:
            return float(text) if "." in text else int(text)
        except ValueError as error:
            raise Rejection(f"{self.key} is a number: {text} is not one") from error

    @property
    def feature(self) -> str:
        return self.key.split(".", 1)[0]

    @property
    def name(self) -> str:
        return self.key.split(".", 1)[1]
