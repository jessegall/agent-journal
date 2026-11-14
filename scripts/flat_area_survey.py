"""Prints the survey of flat areas as Markdown: the files of every engine area by sort with their importer counts,
and every module's support folder. Run it to renew the Wave 2 survey report."""

import ast
import re
import subprocess
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMPORT_LINE = re.compile(r"^\s*(?:from|import)\s+([\w.]+)", re.MULTILINE)
ERROR_ENDINGS = ("_error", "_refusal")
QUERY_ENDINGS = ("_query", "_queries")
PORT_BASES = ("ABC", "Protocol")


def tracked_files(*folders: str) -> list[Path]:
    listed = subprocess.run(["git", "ls-files", *folders], capture_output=True, text=True, cwd=ROOT, check=True).stdout.splitlines()
    return [Path(line) for line in listed if line.endswith(".py")]


class FlatAreaSurvey:
    """Counts the Python files of each engine area and each module support folder, by sort and by importers."""

    def __init__(self) -> None:
        self.source_files = [path for path in tracked_files("src") if path.name != "__init__.py"]
        self.texts = {path: (ROOT / path).read_text() for path in tracked_files("src", "tests", "scripts")}
        self.import_counts = Counter(name for text in self.texts.values() for name in set(IMPORT_LINE.findall(text)))

    def area_names(self) -> list[str]:
        return sorted({path.parts[2] for path in self.source_files if path.parts[1] == "engine" and len(path.parts) > 3})

    def area_files(self, area: str) -> list[Path]:
        return [path for path in self.source_files if path.parts[1:3] == ("engine", area)]

    def importer_count(self, path: Path) -> int:
        return self.import_counts[".".join(path.with_suffix("").parts[1:])]

    def file_sort(self, path: Path) -> str:
        if path.stem.endswith(ERROR_ENDINGS):
            return "error"
        classes = [node for node in ast.parse(self.texts[path]).body if isinstance(node, ast.ClassDef)]
        if not classes:
            return "functions or values"
        bases = [ast.unparse(base).rpartition(".")[2] for base in classes[0].bases]
        if any("Enum" in base for base in bases):
            return "enum"
        if "Model" in bases:
            return "model"
        if path.stem.endswith(QUERY_ENDINGS) or any(base.endswith(("Query", "Queries")) for base in bases):
            return "query"
        if any(base in PORT_BASES for base in bases):
            return "port"
        return "support class"

    def sort_counts(self, files: list[Path]) -> str:
        return ", ".join(f"{count} {sort}" for sort, count in Counter(self.file_sort(path) for path in files).most_common())

    def most_imported(self, files: list[Path]) -> str:
        return ", ".join(f"{path.stem} ({self.importer_count(path)})" for path in sorted(files, key=self.importer_count, reverse=True)[:3])

    def area_row(self, area: str) -> tuple[int, str]:
        files = self.area_files(area)
        flat = [path for path in files if len(path.parts) == 4]
        folders = sorted({path.parts[3] for path in files if len(path.parts) > 4})
        cells = [area, len(files), len(flat), len(files) - len(flat), ", ".join(folders) or "none", self.sort_counts(flat), self.most_imported(flat)]
        return len(flat), "| " + " | ".join(str(cell) for cell in cells) + " |"

    def support_folders(self) -> dict[str, list[Path]]:
        folders: dict[str, list[Path]] = defaultdict(list)
        for path in self.source_files:
            if "support" in path.parts and path.parts[1] in ("core", "suites"):
                folders["/".join(path.parts[1:path.parts.index("support")])].append(path)
        return folders

    def lines(self) -> list[str]:
        areas = self.area_names()
        rows = sorted((self.area_row(area) for area in areas), reverse=True)
        support = sorted(self.support_folders().items(), key=lambda item: -len(item[1]))
        return [
            "## Flat areas of src/engine", "",
            "| Area | Files tracked | Flat files | In folders | Folders | By sort | Most imported flat files |", "|---|---|---|---|---|---|---|",
            *(row for _, row in rows), "",
            f"Total: {sum(len(self.area_files(area)) for area in areas)} files in {len(areas)} areas, __init__.py not counted.", "",
            "## Support folders of the modules", "",
            "| Module | Files in support | By sort | Most imported |", "|---|---|---|---|",
            *(f"| {module} | {len(files)} | {self.sort_counts(files)} | {self.most_imported(files)} |" for module, files in support), "",
            f"Total: {sum(len(files) for _, files in support)} files in {len(support)} support folders.",
        ]


if __name__ == "__main__":
    print("\n".join(FlatAreaSurvey().lines()))
