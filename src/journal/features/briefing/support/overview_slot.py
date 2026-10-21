from dataclasses import dataclass


@dataclass(frozen=True)
class OverviewSlot:
    """A name an overview command may hold as {{name}}, with the value it stands for now and what is said when there is none."""

    name: str
    value: str
    absent: str

    @property
    def marker(self) -> str:
        return "{{" + self.name + "}}"

    def is_missing(self, command: str) -> bool:
        return self.marker in command and not self.value

    def emptied(self, command: str) -> str:
        return command.replace(self.marker, "").strip()

    def filled(self, command: str) -> str:
        return command.replace(self.marker, self.value)
