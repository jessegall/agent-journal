from dataclasses import dataclass

from journal.support.operation import Operation


@dataclass(frozen=True)
class FileWrite(Operation):
    """A file written whole, new or over what was there."""

    kind = "file write"
    path: str

    def writes(self) -> bool:
        return True

    def target_paths(self) -> tuple[str, ...]:
        return (self.path,)
