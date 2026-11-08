import re
from collections import Counter
from collections.abc import Iterator
from dataclasses import dataclass
from pathlib import Path

from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.file_access import FileAccess

INSTRUCTION_FILES = ("CLAUDE.md", "AGENTS.md")
SKIPPED_FOLDERS = frozenset((".git", ".journal", "node_modules", ".venv", "dist", "vendor"))
IMPORT_LINE = re.compile(r"^@(\S+\.md)\s*$", re.MULTILINE)
IMPORT_TWICE = NudgeDeclaration("agents.instruction-import-twice", NudgeType.NOTICE, "{path} imports {other} {count} times, so its text is in every context that often: keep one import",
                                turn_limited=False, path_fields=("path", "other"))
IMPORT_CYCLE = NudgeDeclaration("agents.instruction-import-cycle", NudgeType.NOTICE, "{path} and {other} import each other: keep the import in one of them",
                                turn_limited=False, path_fields=("path", "other"))
INSTRUCTION_NUDGES = [IMPORT_TWICE, IMPORT_CYCLE]


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
