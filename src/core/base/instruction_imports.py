import re
from collections import Counter
from collections.abc import Iterator
from dataclasses import dataclass
from pathlib import Path

from core.base.file_access import FileAccess

INSTRUCTION_FILES = ("CLAUDE.md", "AGENTS.md")
SKIPPED_FOLDERS = frozenset((".git", ".journal", "node_modules", ".venv", "dist", "vendor"))
IMPORT_LINE = re.compile(r"^@(\S+\.md)\s*$", re.MULTILINE)


@dataclass(frozen=True)
class InstructionImport:
    """One file an instruction file imports, how many times it names it, and whether that file imports it back."""

    file: str
    imported: str
    count: int
    imports_back: bool


class InstructionImports:
    """The CLAUDE.md and AGENTS.md files of a project and the files they import with an @ line, which an agent
    program reads into every context: an import named twice, or two files that import each other, puts the same
    text into the context more than once."""

    def __init__(self, root: Path) -> None:
        self.root = root

    def faults(self) -> list[InstructionImport]:
        found = [entry for file in self.files() for entry in self.imports(file)]
        return [entry for entry in found if entry.count > 1 or entry.imports_back]

    def files(self) -> Iterator[Path]:
        for folder, folders, names in self.root.walk():
            folders[:] = [name for name in folders if name not in SKIPPED_FOLDERS]
            yield from (folder / name for name in names if name in INSTRUCTION_FILES)

    def imports(self, file: Path) -> Iterator[InstructionImport]:
        for name, count in Counter(self.imported_names(file)).items():
            imported = (file.parent / name).resolve()
            imports_back = file.resolve() < imported and imported.is_file() and any((imported.parent / back).resolve() == file.resolve() for back in self.imported_names(imported))
            yield InstructionImport(str(file.relative_to(self.root)), name, count, imports_back)

    @staticmethod
    def imported_names(file: Path) -> list[str]:
        return IMPORT_LINE.findall(FileAccess.shared().read(file, errors="replace"))

    @staticmethod
    def without_import(text: str, imported: str) -> str:
        lines = text.split("\n")
        places = [number for number, line in enumerate(lines) if line.strip() == f"@{imported}"]
        dropped = set(places[1:]) if len(places) > 1 else set(places)
        return "\n".join(line for number, line in enumerate(lines) if number not in dropped)
