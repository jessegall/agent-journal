import ast
import re
from collections.abc import Iterator
from functools import cache
from pathlib import Path
from string import Formatter
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

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
        for node in ast.walk(ast.parse(source.read_text())):
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


def raw_values(text: str, relative: str) -> list[str]:
    found = [f"nudge text {pattern.pattern[:40]}" for pattern in nudge_patterns() if pattern.search(text)]
    if not any(word in relative for word in KEPT_AS_WRITTEN):
        found += [f"setting key {key}" for key in SETTING_KEY.findall(text) if key.rstrip(".").rsplit(".", 1)[-1] in setting_keys()]
    if not relative.startswith(CORE_UNIT_TESTS):
        found += [f"profile name {name}" for name in profile_names().findall(text)]
    return found


def raw_value_lines(path: Path) -> list[str]:
    relative = str(path.relative_to(PROJECT))
    return [f"{relative}:{line} {value}" for line, text in literal_texts(ast.parse(path.read_text())) for value in raw_values(text, relative)]


def test_no_test_writes_a_value_the_code_declares():
    found = [line for path in sorted(TESTS_FOLDER.rglob("*.py")) if path != Path(__file__).resolve() for line in raw_value_lines(path)]
    assert found == [], ("take the value from its declaration: said(NUDGE) or NUDGE.nudge(...).text for a nudge, the key constant for a "
                         "setting, PROFILE.name for a shipped profile, story.number_default(KEY) for a default:\n" + "\n".join(found))


def test_the_scan_finds_a_raw_nudge_a_raw_setting_key_and_a_raw_profile_name(tmp_path):
    sample = tmp_path / "sample_test.py"
    nudge = next(call for call in declared_calls(NUDGE_DECLARATION) if len(text_argument(call, 2)) >= SHORTEST_NUDGE_WORDS and all(field is None for *_, field, _, _ in Formatter().parse(text_argument(call, 2))))
    key = next(key for key in sorted(setting_keys()) if SETTING_KEY.fullmatch(f"journal.{key}"))
    sample.write_text(f"NUDGE = {text_argument(nudge, 2)!r}\nKEY = 'journal.core.anything.{key}'\nPROFILE = '{RESEARCHER_PROFILE.name}'\n")
    kinds = {line.split(" ", 1)[1].split(" ")[0] + " " + line.split(" ", 1)[1].split(" ")[1] for line in raw_values_of(sample)}
    assert kinds == {"nudge text", "setting key", "profile name"}, kinds


def raw_values_of(path: Path) -> list[str]:
    return [f"{line} {value}" for line, text in literal_texts(ast.parse(path.read_text())) for value in raw_values(text, "tests/stories/sample.py")]
