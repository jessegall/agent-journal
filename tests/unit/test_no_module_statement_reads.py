import ast
from pathlib import Path
from tests.unit.source_tree import source_tree

"""Story 56 of doc 1255: a module reads through its model's query; no module hands SQL text to database.rows."""

ROOT = Path(__file__).resolve().parents[2]
MODULE_FOLDERS = (ROOT / "src" / "core", ROOT / "src" / "suites", ROOT / "src" / "server")


def statement_reads(path: Path, root: Path) -> list[str]:
    """The lines of a file that call rows(...) with a Statement built in the call."""
    relative = path.relative_to(root).as_posix()
    return [f"{relative}:{node.lineno}" for node in ast.walk(source_tree(path))
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == "rows"
            and any(isinstance(argument, ast.Call) and "Statement" in ast.unparse(argument.func) for argument in node.args)]


def test_no_module_calls_database_rows_with_a_statement():
    found = [line for folder in MODULE_FOLDERS for path in sorted(folder.rglob("*.py")) if "__pycache__" not in path.parts for line in statement_reads(path, ROOT)]
    assert found == []


def test_a_statement_read_is_found_where_it_is_written(tmp_path: Path):
    sample = tmp_path / "sample_read.py"
    sample.write_text('tasks = queries.query(Task).filter(id=1).first()\nrows = database.rows(Statement.row_state("tasks", 1))\n')
    assert statement_reads(sample, tmp_path) == ["sample_read.py:2"]
