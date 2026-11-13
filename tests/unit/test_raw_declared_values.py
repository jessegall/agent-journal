import ast
import re
from collections.abc import Iterator
from functools import cache
from pathlib import Path
from string import Formatter
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE
from tests.unit.source_tree import source_tree

PROJECT = Path(__file__).resolve().parents[2]
TESTS_FOLDER = PROJECT / "tests"
SOURCE_FOLDER = PROJECT / "src"
NUDGE_DECLARATION = "NudgeDeclaration"
SETTING_VALUE = "SettingValue"
AGENT_PROFILE = "AgentProfile"
SHIPPED_PROFILES = SOURCE_FOLDER / "suites" / "coding" / "support" / "shipped_profiles.py"
SHORTEST_NUDGE_WORDS = 12
NUDGE_VALUE = r"\S+"
SETTING_KEY = re.compile(r"journal\.[a-z0-9_.-]+")
KEPT_AS_WRITTEN = ("migration", "upgrade", "legacy", "old_views")
CORE_UNIT_TESTS = "tests/unit/core/"
SETTING_SET = "setting set"
COUNTED_ANYWAY = (0, 1)


def literal_texts(tree: ast.Module) -> Iterator[tuple[int, str]]:
    """Every string a test writes, an f-string read as its fixed parts with each value as one line break so
    no declared text is found across a value."""
    inner = {id(value) for node in ast.walk(tree) if isinstance(node, ast.JoinedStr) for value in node.values}
    for node in ast.walk(tree):
        if isinstance(node, ast.Constant) and isinstance(node.value, str) and id(node) not in inner:
            yield node.lineno, node.value
        elif isinstance(node, ast.JoinedStr):
            yield node.lineno, "".join(value.value if isinstance(value, ast.Constant) else "\n" for value in node.values)


def declared_calls(name: str, path: Path | None = None) -> Iterator[ast.Call]:
    for source in [path] if path else SOURCE_FOLDER.rglob("*.py"):
        for node in ast.walk(source_tree(source)):
            if isinstance(node, ast.Call) and getattr(node.func, "id", "") == name:
                yield node


def text_argument(call: ast.Call, place: int) -> str:
    argument = call.args[place] if len(call.args) > place else None
    return argument.value if isinstance(argument, ast.Constant) and isinstance(argument.value, str) else ""


def nudge_pattern(text: str) -> re.Pattern[str]:
    parts = [re.escape(literal) + ("" if field is None else NUDGE_VALUE) for literal, field, _, _ in Formatter().parse(text)]
    return re.compile("".join(parts))


@cache
def nudge_patterns() -> tuple[re.Pattern[str], ...]:
    texts = {text_argument(call, 2) for call in declared_calls(NUDGE_DECLARATION)}
    return tuple(nudge_pattern(text) for text in texts if sum(len(literal) for literal, *_ in Formatter().parse(text)) >= SHORTEST_NUDGE_WORDS)


@cache
def setting_keys() -> frozenset[str]:
    return frozenset(text_argument(call, 0) for call in declared_calls(SETTING_VALUE)) - {""}


@cache
def profile_names() -> re.Pattern[str]:
    names = sorted({text_argument(call, 0) for call in declared_calls(AGENT_PROFILE, SHIPPED_PROFILES)} - {""}, key=len, reverse=True)
    return re.compile(r"(?<![\w./-])(" + "|".join(re.escape(name) for name in names) + r")(?![\w-])")


@cache
def number_defaults() -> dict[str, int]:
    """The short key of every setting declared with one whole number for its default."""
    matched: dict[str, set[int]] = {}
    for call in declared_calls(SETTING_VALUE):
        for keyword in call.keywords:
            if keyword.arg == "default" and isinstance(keyword.value, ast.Constant) and type(keyword.value.value) is int:
                matched.setdefault(text_argument(call, 0), set()).add(keyword.value.value)
    return {key: next(iter(values)) for key, values in matched.items() if len(values) == 1}


def fixed_text(node: ast.expr) -> str | None:
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    if isinstance(node, ast.JoinedStr):
        return "".join(value.value for value in node.values if isinstance(value, ast.Constant))
    return None


@cache
def key_constant_defaults() -> dict[str, int]:
    """Every constant of the source that holds a setting key, with the whole number its setting defaults to."""
    matched = {}
    for source in SOURCE_FOLDER.rglob("*.py"):
        for node in source_tree(source).body:
            if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
                text = fixed_text(node.value)
                if text is not None and text.rsplit(".", 1)[-1] in number_defaults():
                    matched[node.targets[0].id] = number_defaults()[text.rsplit(".", 1)[-1]]
    return matched


def names_in(node: ast.AST) -> set[str]:
    return {name.id for name in ast.walk(node) if isinstance(name, ast.Name)}


def given_settings(function: ast.FunctionDef) -> set[str]:
    """The key constants a test gives a value of its own: a key of a dict, an item it assigns, an argument of a
    call that sets, or a setting set command; a number beside them is the test's own and no default."""
    given = set()
    for node in ast.walk(function):
        if isinstance(node, ast.Dict):
            given |= {name for key in node.keys if key is not None for name in names_in(key)}
        elif isinstance(node, ast.Assign):
            given |= {name for target in node.targets if isinstance(target, ast.Subscript) for name in names_in(target.slice)}
        elif isinstance(node, ast.Call) and "set" in (getattr(node.func, "attr", "") or getattr(node.func, "id", "")):
            given |= {name for argument in node.args for name in names_in(argument)}
        elif isinstance(node, ast.JoinedStr) and SETTING_SET in (fixed_text(node) or ""):
            given |= names_in(node)
    return given


def raw_default_lines(path: Path) -> list[str]:
    return raw_defaults(source_tree(path), str(path.relative_to(PROJECT)))


def raw_defaults(tree: ast.Module, relative: str) -> list[str]:
    """A whole number a test writes that equals the default of a setting the same test names and gives no value."""
    matched = []
    for function in (node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)):
        named = {name: key_constant_defaults()[name] for name in names_in(function) - given_settings(function) if name in key_constant_defaults()}
        for node in ast.walk(function):
            if isinstance(node, ast.Constant) and type(node.value) is int and node.value not in COUNTED_ANYWAY and node.value in named.values():
                matched += [f"{relative}:{node.lineno} default of {name}" for name, default in named.items() if default == node.value]
    return matched


def raw_values(text: str, relative: str) -> list[str]:
    matched = [f"nudge text {pattern.pattern[:40]}" for pattern in nudge_patterns() if pattern.search(text)]
    if any(word in relative for word in KEPT_AS_WRITTEN):
        return matched
    matched += [f"setting key {key}" for key in SETTING_KEY.findall(text) if key.rstrip(".").rsplit(".", 1)[-1] in setting_keys()]
    if not relative.startswith(CORE_UNIT_TESTS):
        matched += [f"profile name {name}" for name in profile_names().findall(text)]
    return matched


def raw_value_lines(path: Path) -> list[str]:
    relative = str(path.relative_to(PROJECT))
    return [f"{relative}:{line} {value}" for line, text in literal_texts(source_tree(path)) for value in raw_values(text, relative)]


def test_no_test_writes_a_value_the_code_declares():
    matched = [line for path in sorted(TESTS_FOLDER.rglob("*.py")) if path != Path(__file__).resolve() for line in [*raw_value_lines(path), *raw_default_lines(path)]]
    assert matched == [], ("take the value from its declaration: said(NUDGE) or NUDGE.nudge(...).text for a nudge, the key constant for a "
                         "setting, PROFILE.name for a shipped profile, story.number_default(KEY) for a default:\n" + "\n".join(matched))


def test_the_scan_finds_a_raw_nudge_a_raw_setting_key_and_a_raw_profile_name(tmp_path):
    sample = tmp_path / "sample_test.py"
    nudge = next(call for call in declared_calls(NUDGE_DECLARATION) if len(text_argument(call, 2)) >= SHORTEST_NUDGE_WORDS and all(field is None for *_, field, _, _ in Formatter().parse(text_argument(call, 2))))
    key = next(key for key in sorted(setting_keys()) if SETTING_KEY.fullmatch(f"journal.{key}"))
    sample.write_text(f"NUDGE = {text_argument(nudge, 2)!r}\nKEY = 'journal.core.anything.{key}'\nPROFILE = '{RESEARCHER_PROFILE.name}'\n")
    kinds = {line.split(" ", 1)[1].split(" ")[0] + " " + line.split(" ", 1)[1].split(" ")[1] for line in raw_values_of(sample)}
    assert kinds == {"nudge text", "setting key", "profile name"}, kinds


def raw_values_of(path: Path) -> list[str]:
    return [f"{line} {value}" for line, text in literal_texts(source_tree(path)) for value in raw_values(text, "tests/stories/sample.py")]


def test_the_scan_finds_a_raw_setting_default_and_leaves_a_value_the_test_gives():
    name, default = next((name, default) for name, default in sorted(key_constant_defaults().items()) if default not in COUNTED_ANYWAY)
    raw = f"def test_raw(story):\n    assert story.number({name}) == {default}\n"
    given = f"def test_given(story):\n    story.run(f'setting set {{{name}}} {default}')\n    assert story.number({name}) == {default}\n"
    assert (raw_defaults(ast.parse(raw), "sample.py"), raw_defaults(ast.parse(given), "sample.py")) == ([f"sample.py:2 default of {name}"], [])
