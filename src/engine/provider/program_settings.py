from collections.abc import Mapping
from dataclasses import dataclass, field
from pathlib import Path
from engine.provider.settings_file import SettingsFile



@dataclass(frozen=True)
class ProgramSettings:
    """The files the journal writes for one agent program at every start, the links its folder keeps to the
    person's data, and the user's own files it backs up but never reads for a launch, with the bytes of
    those it read to build these settings, so a backup does not read them again, and those it could not read
    or parse."""

    program: str
    files: tuple[SettingsFile, ...]
    links: Mapping[Path, Path] = field(default_factory=dict)
    person_files: tuple[Path, ...] = ()
    person_data: Mapping[Path, bytes] = field(default_factory=dict)
    unreadable_person_files: tuple[Path, ...] = ()

    def person_files_read(self) -> tuple[tuple[Path, bytes | None], ...]:
        return tuple((path, self.person_data.get(path)) for path in self.person_files)
