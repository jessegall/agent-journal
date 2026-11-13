import ast
from pathlib import Path
from engine.model.table import Table
from tests.unit.source_tree import imported_names, imported_object, source_tree

"""Every column a read of src names in its text exists on the model it reads, so a renamed column that a read misses
fails here and not on the first run of that read."""

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src"
SOURCE_FOLDERS = ("engine", "core", "suites", "server")
KEYWORD_METHODS = ("filter", "where")
FIRST_COLUMN_METHODS = ("where", "where_in", "where_not_in", "where_null", "where_not_null", "where_prefix", "where_column", "pluck",
                        "order_by", "counts_after")
EVERY_COLUMN_METHODS = ("group_by", "ordered", "descending", "select_columns")


def text_value(node: ast.expr) -> str | None:
    return node.value if isinstance(node, ast.Constant) and isinstance(node.value, str) else None


def column_arguments(call: ast.Call) -> list[str]:
    method = call.func.attr if isinstance(call.func, ast.Attribute) else ""
    columns = [keyword.arg for keyword in call.keywords if method in KEYWORD_METHODS and keyword.arg]
    if method in FIRST_COLUMN_METHODS and call.args and not (method == "where" and len(call.args) == 1):
        columns.append(text_value(call.args[0]))
    if method in EVERY_COLUMN_METHODS:
        columns += [text_value(argument) for argument in call.args]
    return [column for column in columns if column and "." not in column]


def queried_model_name(call: ast.Call) -> str | None:
    node: ast.expr = call
    while isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
        if node.func.attr == "query" and len(node.args) == 1 and isinstance(node.args[0], ast.Name):
            return node.args[0].id
        node = node.func.value
    return None


def unknown_columns(tree: ast.Module) -> list[str]:
    names = imported_names(tree)
    misses = []
    for call in (node for node in ast.walk(tree) if isinstance(node, ast.Call)):
        model_name = queried_model_name(call)
        columns = column_arguments(call)
        if not columns or model_name not in names or model_name is None:
            continue
        table = Table.build(imported_object(*names[model_name]))
        misses += [f"{call.lineno} {model_name} has no column {column}" for column in columns if not table.has_column(column)]
    return misses


def source_files() -> list[Path]:
    return [path for folder in SOURCE_FOLDERS for path in sorted((SOURCE / folder).rglob("*.py"))
            if "__pycache__" not in path.parts and "migrations" not in path.parts]


def test_every_column_a_read_names_exists_on_its_model():
    misses = [f"{path.relative_to(ROOT)}:{miss}" for path in source_files() for miss in unknown_columns(source_tree(path))]
    assert not misses, "reads that name a column their model lacks:\n" + "\n".join(misses)


def test_a_read_of_a_renamed_column_is_caught(tmp_path):
    planted = tmp_path / "planted.py"
    planted.write_text("from core.modules.tasks.models.task import Task\n\n"
                       "def read(queries):\n    return queries.query(Task).filter(renamed_away=1).where_null(\"gone\").first()\n")
    assert unknown_columns(source_tree(planted)) == ["4 Task has no column gone", "4 Task has no column renamed_away"]
