import ast
from pathlib import Path
from tests.unit.source_tree import source_tree

"""Story 14 of doc 1255: every walk over all the rows of a read is listed with its reason, so a reviewer reads each
one and a new walk shows in the change that adds it."""

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src"
WALKS_FILE = ROOT / "tests" / "snapshots" / "every_row_reads.txt"
QUERY_FILE = SOURCE / "engine" / "query" / "query.py"
FEWEST_REASON_TERMS = 4
WALK_METHODS = ("every_row", "all_weighted")


class UnnamedReasonError(AssertionError):
    pass


def module_strings(tree: ast.Module) -> dict[str, str]:
    """The module-level constants of a file that hold one string."""
    strings: dict[str, str] = {}
    for node in tree.body:
        if isinstance(node, ast.Assign) and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
            strings.update({target.id: node.value.value for target in node.targets if isinstance(target, ast.Name)})
    return strings


def imported_strings(tree: ast.Module) -> dict[str, str]:
    """The string constants a file imports by name from another file of src."""
    strings: dict[str, str] = {}
    for node in tree.body:
        source = SOURCE / f"{node.module.replace('.', '/')}.py" if isinstance(node, ast.ImportFrom) and node.module else None
        if source is not None and source.is_file():
            constants = module_strings(source_tree(source))
            strings.update({alias.asname or alias.name: constants[alias.name] for alias in node.names if alias.name in constants})
    return strings


def reason(call: ast.Call, strings: dict[str, str], place: str) -> str:
    argument = call.args[0] if call.args else None
    if isinstance(argument, ast.Constant) and isinstance(argument.value, str):
        return argument.value
    if isinstance(argument, ast.Name) and argument.id in strings:
        return strings[argument.id]
    raise UnnamedReasonError(f"{place}: write the reason as a string literal or a module constant")


def passed_on(tree: ast.Module) -> set[int]:
    """The walk calls that hand on a reason their own caller gave, such as a helper that walks and sorts: their callers
    are the walks listed."""
    calls: set[int] = set()
    for function in (node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)):
        parameters = {argument.arg for argument in function.args.args}
        calls.update(id(call) for call in ast.walk(function) if isinstance(call, ast.Call) and call.args and isinstance(call.args[0], ast.Name) and call.args[0].id in parameters)
    return calls


def walks() -> list[str]:
    lines: list[str] = []
    for path in sorted(SOURCE.rglob("*.py")):
        if "__pycache__" in path.parts or path == QUERY_FILE:
            continue
        tree = source_tree(path)
        strings, handed_on = {**imported_strings(tree), **module_strings(tree)}, passed_on(tree)
        relative = path.relative_to(ROOT).as_posix()
        for node in ast.walk(tree):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr in WALK_METHODS and id(node) not in handed_on:
                lines.append(f"{relative}:{reason(node, strings, f'{relative}:{node.lineno}')}")
    return sorted(lines)


def listed() -> list[str]:
    return [line for line in WALKS_FILE.read_text().split("\n") if line]


def test_every_walk_in_src_is_listed_in_the_snapshot():
    missing = sorted(set(walks()) - set(listed()))
    assert not missing, f"a new every_row call fails until tests/snapshots/every_row_reads.txt lists it in the same change; the reviewer reads each reason: {missing}"


def test_a_walk_that_is_gone_is_taken_off_the_snapshot():
    removed = sorted(set(listed()) - set(walks()))
    assert not removed, f"take these lines off tests/snapshots/every_row_reads.txt: {removed}"


def has_enough_terms(reason: str) -> bool:
    return len(reason.split()) >= FEWEST_REASON_TERMS


def test_every_walk_gives_a_reason_longer_than_three_words():
    short = [line for line in walks() if not has_enough_terms(line.split(":", 1)[1])]
    assert not short, f"say in a sentence what needs every row: {short}"


def test_a_walk_reason_that_says_nothing_is_rejected():
    """Story 60: a reason of one word passes no review. The test refuses the words alone; reading whether a reason
    of four words is true stays the reviewer's rule, who reads each new line of the snapshot."""
    assert [reason for reason in ("needed", "all", "rows") if has_enough_terms(reason)] == []
    assert has_enough_terms("the board shows every open task")


def test_the_reason_of_a_walk_is_not_empty():
    assert all(line.split(":", 1)[1].strip() for line in walks())
