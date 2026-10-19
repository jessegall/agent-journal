from dataclasses import dataclass


@dataclass(frozen=True)
class Option:
    """A setting a feature reads, declared once: its key as feature.name, the words the settings page shows, its default and its kind."""

    key: str
    title: str
    abstract: str
    default: object
    kind: str = "number"
    """number, switch, text, choice or model."""
    unit: str = ""
    choices: tuple[str, ...] = ()
    provider: str = ""
    """The provider whose models a model option lists."""

    @property
    def feature(self) -> str:
        return self.key.split(".", 1)[0]

    @property
    def name(self) -> str:
        return self.key.split(".", 1)[1]
