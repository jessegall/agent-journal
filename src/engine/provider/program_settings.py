from collections.abc import Mapping
from dataclasses import dataclass, field
from pathlib import Path

READ_ONLY_MODE = 0o444


@dataclass(frozen=True)
class SettingsFile:
    """One file the journal owns for an agent program: where it goes, its whole text and its permission bits."""

    path: Path
    text: str
    mode: int = READ_ONLY_MODE

    @property
    def data(self) -> bytes:
        return self.text.encode()


@dataclass(frozen=True)
class ProgramSettings:
    """The files the journal writes for one agent program at every start, the links its folder keeps to the
    person's data, and the person's own files it backs up but never reads for a launch, with the bytes of those
    it read to build these settings, so a backup does not read them again."""

    program: str
    files: tuple[SettingsFile, ...]
    links: Mapping[Path, Path] = field(default_factory=dict)
    person_files: tuple[Path, ...] = ()
    person_data: Mapping[Path, bytes] = field(default_factory=dict)
