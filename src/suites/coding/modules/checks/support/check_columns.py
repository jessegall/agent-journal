from dataclasses import dataclass

from core.base.library.library_share import Fields


@dataclass(frozen=True)
class CheckColumns:
    """The columns of a check that are sent to the library and back: its title, command, brief and interval."""

    title: str
    command: str
    brief: str
    interval_minutes: int

    @classmethod
    def parsed(cls, fields: Fields) -> "CheckColumns":
        return cls(str(fields["title"]), str(fields["command"]), str(fields["brief"]), int(str(fields["interval_minutes"])))
