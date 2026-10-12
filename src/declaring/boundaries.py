"""What a feature may name, and what it may not.

A feature declares; it does not reach. It may name its own package, the shapes a declaration is written
in, the row types and the services it is handed. Anything else - another feature, a controller, the
engine, the providers - is the feature doing work that belongs elsewhere, and the import is the proof.

The walk reports until the journal is ready to refuse, so the list it prints is the work still to do.
"""

import ast
from dataclasses import dataclass
from pathlib import Path


PACKAGE = "features"
ALLOWED = ("features", "events", "declaring", "expects", "resources")
"""The packages a feature's module may name: its own, the event catalogue, the declarations, the
expectation grammar a registration is written in, and the row types."""

SERVICES = "engine.services"
"""The one engine module a feature may name, because the services are what a feature is handed."""


@dataclass(frozen=True)
class Reach:
    """One import a feature makes outside what it may name."""

    feature: str
    module: str
    names: str
    line: int

    def said(self) -> str:
        return f"{self.feature}: {self.module} line {self.line} imports {self.names}"


def reached(where: Path) -> list[Reach]:
    """Every import a feature makes outside what a feature may name, in the order the files are read."""
    return [found for name in sorted(package.name for package in (where / PACKAGE).iterdir() if (package / "__init__.py").is_file())
            for found in _in_feature(where / PACKAGE / name, name)]


def _in_feature(folder: Path, feature: str) -> list[Reach]:
    return [found for path in sorted(folder.rglob("*.py")) if path.name != "test.py" for found in _in_module(path, feature, folder.parent.parent)]


def _in_module(path: Path, feature: str, root: Path) -> list[Reach]:
    tree = ast.parse(path.read_text())
    return [Reach(feature, str(path.relative_to(root)), _named(node), node.lineno)
            for node in ast.walk(tree) if isinstance(node, (ast.Import, ast.ImportFrom)) and _outside(node)]


def _outside(node) -> bool:
    module = node.module if isinstance(node, ast.ImportFrom) else ""
    if isinstance(node, ast.ImportFrom) and node.level:
        return False
    names = [module] if module else [alias.name for alias in node.names]
    return any(_refused(name) for name in names)


def _refused(name: str) -> bool:
    head = name.split(".")[0]
    return head in _ours() and head not in ALLOWED and not name.startswith(SERVICES)


def _ours() -> set[str]:
    return {"commands", "controllers", "declaring", "engine", "events", "expects", "features", "framework",
            "migrations", "payload", "providers", "receiving", "resources", "serving", "surfaces", "agents",
            "supervisor", "runner", "skills", "install"}


def _named(node) -> str:
    if isinstance(node, ast.ImportFrom):
        return f"{node.module} ({', '.join(alias.name for alias in node.names)})"
    return ", ".join(alias.name for alias in node.names)


def report(where: Path) -> list[str]:
    """What the features reach for today, by the package they reach into, so the list a release has to close can be read at a glance."""
    found = reached(where)
    if not found:
        return ["every feature names only what a feature may name"]
    counted: dict[str, int] = {}
    for one in found:
        counted[one.names.split(" ")[0].split(".")[0]] = counted.get(one.names.split(" ")[0].split(".")[0], 0) + 1
    files, features = len({one.module for one in found}), len({one.feature for one in found})
    return [f"{len(found)} imports a feature may not make, in {files} files of {features} features",
            *(f"  {name}: {count}" for name, count in sorted(counted.items(), key=lambda pair: -pair[1]))]


def grew(found: list[Reach], before: list[str]) -> list[str]:
    """The reaches a feature makes that were not there when the baseline was taken. The list is being driven to nothing by the moves of plan 33, so it may shrink freely; what it may not do is grow."""
    held = set(before)
    return [one.said() for one in found if one.said() not in held]


def lines_of(found: list[Reach]) -> list[str]:
    return [one.said() for one in found]
