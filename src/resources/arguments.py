"""What a call to an action names: the arguments, the row, and the setting it sets."""

from dataclasses import dataclass, field

from resources.fields import Loaded


@dataclass(frozen=True)
class Setting:
    """One setting a call names: the key and the value it sets it to. They never travel apart - every reader that wants one wants both - so nothing is handed a value without the key it belongs to."""

    key: str = ""
    value: object = ""

    def named(self) -> bool:
        return bool(self.key)

    def onto(self, values: dict) -> dict:
        return {**values, self.key: self.value} if self.named() else dict(values)

    def said(self) -> str:
        return str(self.value)

    def differs_from(self, chosen) -> bool:
        """Whether this sets the setting to something other than what it already is."""
        return self.said() != str(chosen)


@dataclass(frozen=True)
class Arguments(Loaded):
    """What a call to an action names: every argument, its row, the feature, and the setting it sets."""

    values: dict = field(default_factory=dict)
    n: str = ""
    name: str = ""
    key: str = ""
    value: object = ""

    @classmethod
    def given(cls, body: dict, params: dict) -> "Arguments":
        return cls.from_json({**body, **params, "values": body})

    @property
    def sets(self) -> Setting:
        return Setting(self.key, self.value)

    def writes(self) -> dict:
        """The fields the call writes, with their new values: every argument it names, and the setting it sets."""
        return self.sets.onto(self.values)
