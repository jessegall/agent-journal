import re
from collections import Counter
from collections.abc import Iterator
from pathlib import Path

from core.base.file_access import FileAccess
from core.base.instruction_import import InstructionImport

INSTRUCTION_FILES = ("CLAUDE.md", "AGENTS.md")
JOURNAL_FILE = "JOURNAL.md"
SKIPPED_FOLDERS = frozenset((".git", ".journal", "node_modules", ".venv", "dist", "vendor"))
IMPORT_LINE = re.compile(r"^@(\S+\.md)\s*$", re.MULTILINE)


class InstructionImports:
    """The CLAUDE.md and AGENTS.md files of a project and the files they import with an @ line, which an agent
    program reads into every context: an import named twice, or two files that import each other, puts the
    same text into the context more than once."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.names: dict[tuple[Path, int], list[str]] = {}

    def faults(self) -> list[InstructionImport]:
        repeated = [entry for file in self.files() for entry in self.imports(file)]
        return [entry for entry in repeated if entry.count > 1 or entry.is_circular]

    def files(self) -> Iterator[Path]:
        for folder, folders, names in self.root.walk():
            folders[:] = [name for name in folders if name not in SKIPPED_FOLDERS]
            yield from (folder / name for name in names if name in INSTRUCTION_FILES)

    def imports(self, file: Path) -> Iterator[InstructionImport]:
        for name, count in Counter(self.import_names(file)).items():
            imported = (file.parent / name).resolve()
            is_circular = file.resolve() < imported and imported.is_file() and any((imported.parent / relative).resolve() == file.resolve() for relative in self.import_names(imported))
            yield InstructionImport(str(file.relative_to(self.root)), name, count, is_circular)

    def import_names(self, file: Path) -> list[str]:
        version = (file.resolve(), file.stat().st_mtime_ns)
        if version not in self.names:
            self.names[version] = self.imported_names(file)
        return self.names[version]

    @staticmethod
    def imported_names(file: Path) -> list[str]:
        return IMPORT_LINE.findall(FileAccess.shared().read(file, errors="replace"))

    @staticmethod
    def without_import(text: str, imported: str) -> str:
        lines = text.split("\n")
        places = [number for number, line in enumerate(lines) if line.strip() == f"@{imported}"]
        dropped = set(places[1:]) if len(places) > 1 else set(places)
        return "\n".join(line for number, line in enumerate(lines) if number not in dropped)
