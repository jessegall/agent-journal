from core.base.file_access import FileAccess
from dataclasses import dataclass
from pathlib import Path

from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader

PATTERN_SUFFIX, SCRIPT_SUFFIX = ".pattern", ".sh"
NOTE_MARK = "#"
TITLE_PREFIX = "title: "
SETTING_NAMES = {"progress: ": "progress_pattern", "title: ": "title", "label: ": "subject", "commands: ": "commands", "topic: ": "topic_pattern", "finished: ": "finished_pattern",
                 "failed: ": "failed_pattern", "summary: ": "summary_pattern"}


@dataclass(frozen=True)
class ReaderFile:
    """A reader written as a file, as version 4 kept them and plugins ship them: a .pattern file holds its
    title line, its pattern line and its settings, one per line; a .sh script holds its settings in # lines
    and is the reader itself. Every file declares title: ; a file that opens on a comment instead is
    rewritten once, when it is loaded, with that comment as its title."""

    name: str
    type: ReaderType
    lines_pattern: str
    script: str
    settings: dict[str, str]

    @classmethod
    def parsed(cls, path: Path) -> "ReaderFile":
        lines = cls.titled(path, FileAccess.shared().read(path).splitlines())
        if path.suffix == SCRIPT_SUFFIX:
            notes = [line.removeprefix(NOTE_MARK).strip() for line in lines if line.startswith(NOTE_MARK) and not line.startswith("#!")]
            return cls(path.stem, ReaderType.SCRIPT, "", str(path), cls.read_settings(notes))
        return cls(path.stem, ReaderType.PATTERN, lines[1] if len(lines) > 1 else "", "", cls.read_settings([*lines[:1], *lines[2:]]))

    @classmethod
    def titled(cls, path: Path, lines: list[str]) -> list[str]:
        is_script = path.suffix == SCRIPT_SUFFIX
        declared = [line.removeprefix(NOTE_MARK).strip() if is_script else line for line in lines]
        if any(line.startswith(TITLE_PREFIX) for line in declared):
            return lines
        place = next((index for index, line in enumerate(lines) if line.startswith(NOTE_MARK) and not line.startswith("#!")), None) if is_script else (0 if lines and lines[0].startswith(NOTE_MARK) else None)
        if place is None:
            return lines
        comment = lines[place].removeprefix(NOTE_MARK).strip()
        if not comment or any(comment.startswith(prefix) for prefix in SETTING_NAMES):
            return lines
        titled = [*lines[:place], f"{NOTE_MARK} {TITLE_PREFIX}{comment}" if is_script else f"{TITLE_PREFIX}{comment}", *lines[place + 1:]]
        FileAccess.shared().write(path, "\n".join(titled) + "\n")
        return titled

    @staticmethod
    def read_settings(lines: list[str]) -> dict[str, str]:
        return {field: line.removeprefix(prefix) for line in lines for prefix, field in SETTING_NAMES.items() if line.startswith(prefix)}

    @staticmethod
    def paths(folder: Path) -> list[Path]:
        return sorted(path for path in folder.glob("*") if path.suffix in (PATTERN_SUFFIX, SCRIPT_SUFFIX)) if folder.is_dir() else []

    @staticmethod
    def found(folder: Path) -> list["ReaderFile"]:
        return [ReaderFile.parsed(path) for path in ReaderFile.paths(folder)]

    def reader(self, creator_id: int, plugin_name: str) -> Reader:
        return Reader(creator_id=creator_id, name=self.name, type=self.type, lines_pattern=self.lines_pattern, script=self.script, plugin_name=plugin_name,
                      commands=self.settings.get("commands", ""), progress_pattern=self.settings.get("progress_pattern", ""),
                      finished_pattern=self.settings.get("finished_pattern", ""), failed_pattern=self.settings.get("failed_pattern", ""),
                      summary_pattern=self.settings.get("summary_pattern", ""), topic_pattern=self.settings.get("topic_pattern", ""), title=self.settings.get("title", ""),
                      subject=self.settings.get("subject", ""))
