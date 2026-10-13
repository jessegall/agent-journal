"""Every package under src says what it may name, and one run holds all of them.

A row is what that package imports today, not an ideal. Several record a reach that is a known
fault with a row of its own: the engine names install and providers, controllers and framework
name each other's callers, and features names runner and serve. So a clean run here says that
nothing new was added, not that the stack is clean. Narrowing a row the moment its fault is fixed
is the point of writing them down; widening one needs its reason in the commit.

The second run holds that every Python package under src has a row at all, so a new one cannot
arrive unexamined - which is what made to-do 4590 invisible until a person read the imports by eye.
"""

import ast
from pathlib import Path

import pytest

SRC = Path(__file__).resolve().parents[1] / "src"

NAMES = {
    "resources": set(),
    "serving": set(),
    "skills": set(),
    "supervisor": set(),
    "declaring": {"resources", "serving"},
    "events": {"resources"},
    "payload": {"resources"},
    "receiving": {"engine", "events", "serving"},
    "expects": {"controllers", "engine", "events", "resources"},
    "engine": {"agents", "declaring", "events", "install", "providers", "resources", "supervisor"},
    "agents": {"controllers", "declaring", "engine", "payload", "providers", "resources", "supervisor"},
    "providers": {"controllers", "declaring", "engine", "framework", "payload", "resources", "serving", "supervisor"},
    "controllers": {"commands", "declaring", "engine", "events", "framework", "resources", "serving"},
    "framework": {"agents", "controllers", "declaring", "engine", "events", "expects", "overview", "payload", "providers", "receiving", "resources", "serving"},
    "overview": {"controllers", "declaring", "engine", "providers", "resources"},
    "mcp_headers": {"controllers", "features", "resources"},
    "migrations": {"controllers", "declaring", "engine", "features", "framework", "providers", "resources"},
    "install": {"commands", "controllers", "engine", "features", "framework", "migrations", "payload", "providers", "resources", "skills"},
    "surfaces": {"controllers", "engine", "features", "framework", "overview", "resources"},
    "runner": {"agents", "controllers", "declaring", "engine", "events", "features", "framework", "payload", "providers", "resources", "supervisor"},
    "serve": {"commands", "controllers", "engine", "features", "framework", "providers", "resources", "runner", "serving", "surfaces"},
    "commands": {"agents", "controllers", "engine", "features", "framework", "install", "migrations", "payload", "providers", "resources", "runner", "serve", "surfaces"},
    "features": {"agents", "commands", "controllers", "declaring", "engine", "events", "expects", "framework", "install", "mcp_headers", "migrations",
                 "overview", "payload", "providers", "receiving", "resources", "runner", "serve", "serving", "skills", "supervisor", "surfaces"},
    "channel": {"providers"},
    "keeper": {"engine"},
    "worker": {"commands"},
    "journal": {"commands", "features"},
    "__main__": {"commands"},
}


def python_places() -> set[str]:
    """Every package and loose module under src that holds Python: the names a row is owed for."""
    loose = {path.stem for path in SRC.glob("*.py")}
    packages = {path.name for path in SRC.iterdir() if path.is_dir() and not path.name.startswith(".") and any(path.rglob("*.py"))}
    return loose | packages


def imported_roots(path: Path) -> set[str]:
    found = set()
    for node in ast.walk(ast.parse(path.read_text())):
        if isinstance(node, ast.Import):
            found |= {alias.name.split(".")[0] for alias in node.names}
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            found.add(node.module.split(".")[0])
    return found


def files_of(place: str) -> list[Path]:
    folder = SRC / place
    return [path for path in folder.rglob("*.py") if "__pycache__" not in path.parts] if folder.is_dir() else [SRC / f"{place}.py"]


@pytest.mark.parametrize("place,allowed", sorted(NAMES.items()))
def test_a_package_names_only_what_its_row_allows(place, allowed):
    own = python_places()
    reaches = {f"{path.relative_to(SRC)}: {root}" for path in files_of(place)
               for root in imported_roots(path) & own - allowed - {place}}
    assert reaches == set(), f"{place} names what its row does not allow: {sorted(reaches)}"


def test_every_python_package_under_src_has_a_row():
    assert python_places() == set(NAMES), \
        f"a package with no row is unexamined: {sorted(python_places() ^ set(NAMES))}"
