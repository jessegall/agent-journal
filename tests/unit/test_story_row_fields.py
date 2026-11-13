import ast
import importlib
import re
from pathlib import Path
from engine.model.model import Model
from engine.model.table import Table
from tests.unit.source_tree import source_tree

"""Every field a story expects in the text of a row's show command is a column of that row's model, so a renamed
column that a story's expected text misses fails here and not at the end of the full run."""

ROOT = Path(__file__).resolve().parents[2]
STORIES = ROOT / "tests" / "stories"
MODEL_FOLDERS = ("src/core", "src/suites")
EXPECTATIONS = ("expect_text", "expect_success")
SHOW_COMMAND = re.compile(r"^([a-z][a-z-]*) show\b")
FIELD_LINE = re.compile(r"^([a-z][a-z_]*): ")
SHOWN_BESIDE_COLUMNS = {"agent": {"display_name", "standing"}, "approval": {"outdated"}, "check": {"state"}, "doc": {"links"},
                        "hook-call": {"layers"}, "memory": {"type"}, "proof": {"stuck", "lost"}, "question": {"choices"},
                        "report": {"links"}, "setting": {"from"}, "task": {"links"}}


def subclasses(model: type) -> list[type]:
    return [model, *(child for direct in model.__subclasses__() for child in subclasses(direct))]


def cli_models() -> dict[str, type[Model]]:
    for folder in MODEL_FOLDERS:
        for path in sorted((ROOT / folder).rglob("models/*.py")):
            importlib.import_module(".".join(path.relative_to(ROOT / "src").with_suffix("").parts))
    return {model.cli_name: model for model in subclasses(Model) if hasattr(model, "cli_name")}


def leading_text(node: ast.expr) -> str | None:
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    if isinstance(node, ast.JoinedStr) and node.values and isinstance(node.values[0], ast.Constant):
        return str(node.values[0].value)
    return None


def unknown_fields(tree: ast.Module, models: dict[str, type[Model]]) -> list[str]:
    misses = []
    for call in (node for node in ast.walk(tree) if isinstance(node, ast.Call)):
        if not isinstance(call.func, ast.Attribute) or call.func.attr not in EXPECTATIONS or not call.args:
            continue
        command = SHOW_COMMAND.match(leading_text(call.args[0]) or "")
        if command is None or command.group(1) not in models:
            continue
        table = Table.build(models[command.group(1)])
        fields = [match.group(1) for argument in call.args[1:] if (match := FIELD_LINE.match(leading_text(argument) or ""))]
        misses += [f"{call.lineno} {command.group(1)} has no field {field}" for field in fields
                   if not table.has_column(field) and field not in SHOWN_BESIDE_COLUMNS.get(command.group(1), set())]
    return misses


def test_every_row_field_a_story_expects_is_a_column_of_its_model():
    models = cli_models()
    misses = [f"{path.relative_to(ROOT)}:{miss}" for path in sorted(STORIES.rglob("*.py")) if "__pycache__" not in path.parts
              for miss in unknown_fields(source_tree(path), models)]
    assert not misses, "story expectations of fields their row does not have:\n" + "\n".join(misses)


def test_an_expected_field_of_a_renamed_column_is_caught(tmp_path):
    planted = tmp_path / "planted.py"
    planted.write_text('def test_it(story):\n    story.expect_text("task show 1", "title: Fix", "renamed_away: start", actor=story.agent)\n')
    assert unknown_fields(source_tree(planted), cli_models()) == ["2 task has no field renamed_away"]
