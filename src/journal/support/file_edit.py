from dataclasses import dataclass

from journal.support.operation import Operation


@dataclass(frozen=True)
class FileEdit(Operation):
    """A change to files that are there: the paths it writes."""

    kind = "file edit"
    paths: tuple[str, ...]

    def writes(self) -> bool:
        return True

    def target_paths(self) -> tuple[str, ...]:
        return self.paths
