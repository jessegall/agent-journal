"""The packages that sit below the features name nothing above them.

declaring holds what a feature is declared with and the events catalogue what it is told, so both are read by
every feature; if either reached up into the engine or a provider, a feature could not be loaded without them.
"""

import ast
from pathlib import Path

import pytest

SRC = Path(__file__).resolve().parents[1] / "src"
BELOW = {"declaring": {"declaring", "resources"}, "events": {"events", "resources"}}


def imported_roots(path: Path) -> set[str]:
    found = set()
    for node in ast.walk(ast.parse(path.read_text())):
        if isinstance(node, ast.Import):
            found |= {alias.name.split(".")[0] for alias in node.names}
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            found.add(node.module.split(".")[0])
    return found


@pytest.mark.parametrize("package,allowed", sorted(BELOW.items()))
def test_a_package_below_the_features_names_nothing_above_them(package, allowed):
    own = {p.name for p in SRC.iterdir() if p.is_dir()} | {p.stem for p in SRC.glob("*.py")}
    reaches = {f"{path.relative_to(SRC)}: {root}" for path in (SRC / package).rglob("*.py") for root in imported_roots(path) & own - allowed}
    assert reaches == set(), f"{package} reaches above itself: {sorted(reaches)}"
