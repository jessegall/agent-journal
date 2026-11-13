import ast
import importlib
from pathlib import Path
from tests.unit.source_tree import imported_names, imported_value, source_tree

"""Every attribute a test patches by its name exists, so a rename that misses a patch fails here and not at run time."""

ROOT = Path(__file__).resolve().parents[2]
TESTS = ROOT / "tests"
ATTRIBUTE_PATCHES = ("setattr", "delattr", "object")
PATH_PATCHES = ("setattr", "delattr", "patch")
CREATING_KEYWORDS = {"raising": False, "create": True}


def creates_the_attribute(call: ast.Call) -> bool:
    return any(keyword.arg in CREATING_KEYWORDS and isinstance(keyword.value, ast.Constant)
               and keyword.value.value == CREATING_KEYWORDS[keyword.arg] for keyword in call.keywords)


def text_argument(call: ast.Call, position: int) -> str | None:
    if len(call.args) > position and isinstance(call.args[position], ast.Constant) and isinstance(call.args[position].value, str):
        return call.args[position].value
    return None


def patch_calls(tree: ast.Module) -> list[ast.Call]:
    return [node for node in ast.walk(tree) if isinstance(node, ast.Call) and not creates_the_attribute(node)
            and (isinstance(node.func, ast.Attribute) and node.func.attr in ATTRIBUTE_PATCHES + PATH_PATCHES
                 or isinstance(node.func, ast.Name) and node.func.id == "patch")]


def value_at_path(path: str) -> object:
    parts = path.split(".")
    for cut in range(len(parts) - 1, 0, -1):
        try:
            target = importlib.import_module(".".join(parts[:cut]))
        except ImportError:
            continue
        for part in parts[cut:]:
            target = getattr(target, part)
        return target
    raise ImportError(path)


def missing_attribute_target(call: ast.Call, names: dict[str, tuple[str, str | None]]) -> str | None:
    attribute = text_argument(call, 1)
    target = call.args[0] if call.args else None
    if attribute is None or not isinstance(target, ast.Name) or target.id not in names:
        return None
    patched = imported_value(*names[target.id])
    return None if hasattr(patched, attribute) else f"{target.id}.{attribute}"


def missing_path_target(call: ast.Call) -> str | None:
    path = text_argument(call, 0)
    if path is None or "." not in path or " " in path:
        return None
    try:
        value_at_path(path)
    except AttributeError:
        return path
    return None


def missing_targets(path: Path) -> list[str]:
    tree = source_tree(path)
    names = imported_names(tree)
    misses = [(call, missing_attribute_target(call, names) or missing_path_target(call)) for call in patch_calls(tree)]
    return [f"{path.relative_to(ROOT)}:{call.lineno} {target}" for call, target in misses if target]


def test_every_attribute_a_test_patches_by_name_exists():
    misses = [miss for path in sorted(TESTS.rglob("*.py")) if "__pycache__" not in path.parts for miss in missing_targets(path)]
    assert not misses, "patched attributes that do not exist:\n" + "\n".join(misses)


def test_a_patch_of_a_renamed_attribute_is_caught(tmp_path):
    planted = tmp_path / "test_planted.py"
    planted.write_text('from engine.query.query import Query\n\ndef test_it(monkeypatch):\n'
                       '    monkeypatch.setattr(Query, "renamed_away", None)\n'
                       '    monkeypatch.setattr("engine.query.query.Query.gone", None)\n')
    tree = source_tree(planted)
    assert [missing_attribute_target(call, imported_names(tree)) or missing_path_target(call) for call in patch_calls(tree)] == [
        "Query.renamed_away", "engine.query.query.Query.gone"]
