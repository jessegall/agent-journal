"""Prints the survey of files that sit with the wrong owner as Markdown: one section for each sort of misplacement,
with its count and its files. Run it to renew the Wave 3 survey report."""

import ast
import re
import subprocess
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SETTING_KEY = re.compile(r"^(?:journal\.core|coding)\.([a-z][a-z_-]*)\.[a-z][a-z0-9-]*$")
CATCH_ALL_ENDINGS = ("_settings", "_nudges", "_helpers", "_utils", "_misc", "_common")
SHARED_CACHE_METHODS = ("replace_cached", "remember")
DRIVER_WORDS = ("main", "worker", "helper", "merger", "reviewer")
LISTED_FILES_LIMIT = 40


def tracked_files(*folders: str) -> list[Path]:
    listed = subprocess.run(["git", "ls-files", *folders], capture_output=True, text=True, cwd=ROOT, check=True).stdout.splitlines()
    return [Path(line) for line in listed if line.endswith(".py")]


def snake_case(class_name: str) -> str:
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])", "_", class_name).lower()


class WrongOwnerSurvey:
    """Lists source files whose owner, by a rule a script can check, is another folder than the one they sit in."""

    def __init__(self) -> None:
        self.source_files = [path for path in tracked_files("src") if path.name != "__init__.py"]
        self.test_files = [path for path in tracked_files("tests/unit") if path.name.startswith("test_")]
        self.trees = {path: ast.parse((ROOT / path).read_text()) for path in self.source_files}

    @staticmethod
    def owner(path: Path) -> str:
        parts = path.parts
        if parts[1] == "core" and len(parts) > 4:
            return parts[3]
        if parts[1] == "suites" and len(parts) > 5 and parts[3] == "modules":
            return parts[4]
        if parts[1] in ("suites", "tunnels", "engine") and len(parts) > 3:
            return parts[2]
        return parts[1]

    @staticmethod
    def imported_owner(dotted_name: str) -> str | None:
        parts = dotted_name.split(".")
        if parts[:2] == ["core", "modules"] and len(parts) > 2:
            return parts[2]
        if parts[0] == "suites" and len(parts) > 3 and parts[2] == "modules":
            return parts[3]
        return None

    def imports(self, path: Path) -> list[str]:
        return [node.module for node in ast.walk(self.trees[path]) if isinstance(node, ast.ImportFrom) and node.module]

    def classes(self, path: Path) -> list[ast.ClassDef]:
        return [node for node in self.trees[path].body if isinstance(node, ast.ClassDef)]

    def handlers_apart(self) -> list[str]:
        apart = []
        for path in self.source_files:
            if not path.stem.endswith(("_handler", "_subcommand")):
                continue
            commands = {self.imported_owner(name) for name in self.imports(path) if self.is_command_of(path, name)} - {None, self.owner(path)}
            apart += [f"{path}: its command is in {owner}" for owner in sorted(commands)]
        return apart

    @staticmethod
    def is_command_of(path: Path, dotted_name: str) -> bool:
        if path.stem.endswith("_handler"):
            return dotted_name.endswith(f".commands.{path.parent.name}.{path.stem.removesuffix('_handler')}")
        return ".commands." in dotted_name and not dotted_name.endswith(("_handler", "_subcommand"))

    def setting_keys_apart(self) -> list[str]:
        apart = []
        for path in self.source_files:
            for node in self.trees[path].body:
                if not (isinstance(node, ast.Assign) and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str)):
                    continue
                match = SETTING_KEY.match(node.value.value)
                if match is not None and match.group(1).replace("-", "_") != self.owner(path) and self.owner(path) not in ("engine", "server"):
                    apart.append(f"{path}: {ast.unparse(node.targets[0])} is a key of {match.group(1)}")
        return apart

    def rules_apart(self) -> list[str]:
        apart = []
        for path in self.source_files:
            first_word = path.stem.split("_")[0]
            in_rule_folder = bool({"rules", "guards"} & set(path.parts))
            with_its_driver = first_word in path.parts or self.owner(path).rstrip("s") == first_word
            if in_rule_folder and first_word in DRIVER_WORDS and not with_its_driver:
                apart.append(f"{path}: its name says the {first_word} driver")
        return apart

    def catch_all_files(self) -> list[str]:
        files = []
        for path in self.source_files:
            members = [node for node in self.trees[path].body if isinstance(node, (ast.ClassDef, ast.FunctionDef, ast.Assign))]
            if path.stem.endswith(CATCH_ALL_ENDINGS) and "support" in path.parts and len(members) > 3:
                files.append(f"{path}: collects more than 3 classes, functions and values")
        return files

    def repeated_cache_code(self) -> list[str]:
        files = []
        for path in self.source_files:
            methods = {node.name for node in ast.walk(self.trees[path]) if isinstance(node, ast.FunctionDef)}
            if all(name in methods for name in SHARED_CACHE_METHODS):
                files.append(f"{path}: defines {' and '.join(SHARED_CACHE_METHODS)}")
        return files

    def tests_apart(self) -> list[str]:
        files_by_stem = defaultdict(list)
        for path in self.source_files:
            files_by_stem[path.stem].append(path)
        apart = []
        for test in self.test_files:
            if test.parts[:3] == ("tests", "unit", "scripts"):
                continue
            tested_stem = test.stem.removeprefix("test_")
            mirrored = Path("src", *test.parts[2:-1], f"{tested_stem}.py")
            if len(files_by_stem[tested_stem]) == 1 and mirrored != files_by_stem[tested_stem][0]:
                apart.append(f"{test}: tests {files_by_stem[tested_stem][0]}")
        return apart

    def narrow_support_files_used_wider(self) -> list[str]:
        importers = defaultdict(list)
        for path in self.source_files:
            for name in self.imports(path):
                importers[name].append(path)
        apart = []
        for path in self.source_files:
            if "support" not in path.parts or "commands" not in path.parts[:path.parts.index("support")]:
                continue
            folder = Path(*path.parts[:path.parts.index("support")])
            outside = sorted({str(importer.parent) for importer in importers[".".join(path.with_suffix("").parts[1:])] if folder not in importer.parents})
            if outside:
                apart.append(f"{path}: is imported from {outside[0]}")
        return apart

    def enums_apart(self) -> list[str]:
        apart = []
        for path in self.source_files:
            enum_classes = [node.name for node in self.classes(path) if any("Enum" in ast.unparse(base) for base in node.bases)]
            if enum_classes and "enums" not in path.parts:
                apart.append(f"{path}: {', '.join(enum_classes)}")
        return apart

    def misnamed_files(self) -> list[str]:
        apart = []
        for path in self.source_files:
            classes = self.classes(path)
            if len(classes) == 1 and snake_case(classes[0].name) != path.stem and "migrations" not in path.parts:
                apart.append(f"{path}: has the class {classes[0].name}")
        return apart

    def sections(self) -> dict[str, list[str]]:
        return {
            "1. A handler or subcommand in another module than its command": self.handlers_apart(),
            "2. A setting key constant outside the module the key belongs to": self.setting_keys_apart(),
            "3. A rule or guard whose name says another driver or module": self.rules_apart(),
            "4. Catch-all support files": self.catch_all_files(),
            "5. Files that repeat the cache code": self.repeated_cache_code(),
            "6. Unit test files that do not mirror the path of their source file": self.tests_apart(),
            "7. A support file of one command that another folder imports": self.narrow_support_files_used_wider(),
            "8. Enums outside an enums folder": self.enums_apart(),
            "9. Files whose name is not the name of their one class": self.misnamed_files(),
        }

    def known_lines(self) -> list[str]:
        return sorted(f"{title.split('.')[0]}: {line}" for title, files in self.sections().items() for line in files)

    def lines(self) -> list[str]:
        sections = self.sections()
        lines = ["## Files with the wrong owner", "", "| Sort | Count |", "|---|---|"]
        lines += [f"| {title} | {len(files)} |" for title, files in sections.items()]
        for title, files in sections.items():
            lines += ["", f"### {title}", "", *(f"- {line}" for line in files[:LISTED_FILES_LIMIT])]
            if len(files) > LISTED_FILES_LIMIT:
                lines.append(f"- and {len(files) - LISTED_FILES_LIMIT} more")
        return lines


if __name__ == "__main__":
    print("\n".join(WrongOwnerSurvey().lines()))
