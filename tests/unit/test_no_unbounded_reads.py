import ast
from pathlib import Path

from engine.query.query import Query
from tests.unit.source_tree import source_tree

"""Book 4 of doc 1255, stories 28 to 35: every read that walked a whole table moved to a bounded read or a named
walk, and the old methods are gone."""

ROOT = Path(__file__).resolve().parents[2]
SCANNED_FOLDERS = (ROOT / "src", ROOT / "tests")
GROWING_MODELS = ("HookCall", "Message", "HelperJob", "ProcessPart", "TaskLog", "Agent")
BOUNDING_CALLS = ("where", "filter", "matching", "limit", "page", "where_in", "where_not_in", "where_null", "where_not_null", "where_prefix", "where_column", "where_exists", "where_not_exists")
ALLOWED_BARE_GETS = ROOT / "tests" / "snapshots" / "bare_get_on_growing_tables.txt"
OLD_METHODS = ("all_rows", "limited", "rows_without", "full_table")


def python_files() -> list[Path]:
    return [path for folder in SCANNED_FOLDERS for path in sorted(folder.rglob("*.py")) if "__pycache__" not in path.parts and path != Path(__file__).resolve()]


def matching_calls(path: Path, names: tuple[str, ...]) -> list[str]:
    tree = source_tree(path)
    relative = path.relative_to(ROOT).as_posix()
    return [f"{relative}:{node.lineno}" for node in ast.walk(tree) if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr in names]


def chain_names(call: ast.Call) -> tuple[list[str], str | None]:
    """The method names called on the way down a chain, and the model a query(...) at its root names."""
    names: list[str] = []
    node: ast.expr = call.func
    while True:
        if isinstance(node, ast.Attribute):
            names.append(node.attr)
            node = node.value
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Attribute) and node.func.attr == "query" and node.args and isinstance(node.args[0], ast.Name):
                return names, node.args[0].id
            node = node.func
        else:
            return names, None


def bare_get_lines(path: Path) -> list[int]:
    """The lines of a file that call get() on a query of a growing model with nothing that bounds it."""
    lines: list[int] = []
    for node in ast.walk(source_tree(path)):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == "get" and not node.args and not node.keywords:
            names, model = chain_names(node)
            if model in GROWING_MODELS and not set(names) & set(BOUNDING_CALLS):
                lines.append(node.lineno)
    return lines


def test_no_all_rows_call_is_left():
    matched = [place for path in python_files() for place in matching_calls(path, tuple(["all_rows"]))]
    assert matched == [], "read with get, take, a page or every_row(reason):\n" + "\n".join(matched)


def test_no_limited_or_full_table_call_is_left():
    matched = [place for path in python_files() for place in matching_calls(path, ("limited", "rows_without", "full_table"))]
    assert matched == [], "limited(n) is take(n) or limit(n).get(); full_table goes; rows_without is where_null:\n" + "\n".join(matched)


def test_query_has_no_all_rows_limited_or_full_table_method():
    assert not any(hasattr(Query, name) for name in OLD_METHODS)


def test_a_bare_get_on_a_growing_table_is_listed():
    allowed = {line for line in ALLOWED_BARE_GETS.read_text().split("\n") if line}
    places = [f"{path.relative_to(ROOT).as_posix()}:{line}" for path in python_files() if path.is_relative_to(ROOT / "src") for line in bare_get_lines(path)]
    matched = [place for place in places if place not in allowed]
    assert matched == [], "filter a read of a growing table before get(), or list it with its reason:\n" + "\n".join(matched)


def test_the_bare_get_scan_finds_a_get_with_no_filter_on_a_growing_table(tmp_path):
    sample = tmp_path / "sample.py"
    sample.write_text("rows = queries.query(HookCall).newest().get()\nmine = queries.query(HookCall).filter(id=1).get()\nnames = values.get()\n")
    assert bare_get_lines(sample) == [1]
