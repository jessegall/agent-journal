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
    program reads into every context: an import named twice, or two files that import each other, puts the same
    text into the context more than once."""

    def __init__(self, root: Path) -> None:
        self.root = root
        self.names: dict[Path, list[str]] = {}

    def faults(self) -> list[InstructionImport]:
        found = [entry for file in self.files() for entry in self.imports(file)]
        return [entry for entry in found if entry.count > 1 or entry.imports_back]

    def files(self) -> Iterator[Path]:
        for folder, folders, names in self.root.walk():
            folders[:] = [name for name in folders if name not in SKIPPED_FOLDERS]
            yield from (folder / name for name in names if name in INSTRUCTION_FILES)

    def imports(self, file: Path) -> Iterator[InstructionImport]:
        for name, count in Counter(self.names_of(file)).items():
            imported = (file.parent / name).resolve()
            imports_back = file.resolve() < imported and imported.is_file() and any((imported.parent / back).resolve() == file.resolve() for back in self.names_of(imported))
            yield InstructionImport(str(file.relative_to(self.root)), name, count, imports_back)

    def names_of(self, file: Path) -> list[str]:
        resolved = file.resolve()
        if resolved not in self.names:
            self.names[resolved] = self.imported_names(file)
        return self.names[resolved]

    @staticmethod
    def imported_names(file: Path) -> list[str]:
        return IMPORT_LINE.findall(FileAccess.shared().read(file, errors="replace"))

    @staticmethod
    def without_import(text: str, imported: str) -> str:
        lines = text.split("\n")
        places = [number for number, line in enumerate(lines) if line.strip() == f"@{imported}"]
        dropped = set(places[1:]) if len(places) > 1 else set(places)
        return "\n".join(line for number, line in enumerate(lines) if number not in dropped)
