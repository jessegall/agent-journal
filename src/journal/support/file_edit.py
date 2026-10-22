from dataclasses import dataclass

from journal.support.operation import Operation


@dataclass(frozen=True)
class FileEdit(Operation):
    """A change to files that are there: the paths it writes."""

    kind = "file edit"
    paths: tuple[str, ...]
    added: int = 0
    removed: int = 0

    def activity(self) -> str:
        return "editing"

    def changed_lines(self) -> tuple[int, int]:
        return (self.added, self.removed)

    def writes(self) -> bool:
        return True

    def target_paths(self) -> tuple[str, ...]:
        return self.paths
