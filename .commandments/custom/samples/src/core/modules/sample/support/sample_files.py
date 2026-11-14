from pathlib import Path

from engine.file.file_access import FileAccess


class SampleFiles:
    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def text(self) -> str:
        # @sin architecture_core_file_system_outside_file_access
        return (self.folder / "notes.txt").read_text()

    def has_notes(self) -> bool:
        # @sin architecture_core_file_system_outside_file_access
        return Path(self.folder, "notes.txt").exists()

    def door_text(self) -> str:
        # @righteous architecture_core_file_system_outside_file_access
        return FileAccess.read(self.folder / "notes.txt")
