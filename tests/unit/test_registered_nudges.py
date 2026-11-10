import ast
import re
from pathlib import Path

import pytest
from tests.unit.source_tree import source_text, source_tree

ROOT = Path(__file__).resolve().parents[2]
LONGEST_LINE_CHARACTERS = 120
LONGEST_NOTICE_CHARACTERS = 800
PLACEHOLDER = re.compile(r"\{(\w+)\}")
NUDGE_LIST_NAMES = re.compile(r"NUDGES$")
# what a line may name: a row's number, a count, or a short fact that is no row's words (an instruction is the program's own fixed sentence)
ALLOWED_PLACEHOLDERS = frozenset({"approval", "recipient", "code", "plugin", "targets", "route", "exception", "line", "trigger", "remaining", "reminder", "tool", "limit", "place", "doc",
    "uses", "action", "agent", "block", "branch", "category", "check", "count", "dump", "emoji", "environment", "folder", "job", "kept", "left", "limit", "lines", "memories", "memory", "message",
    "messages", "minutes", "name", "other", "output", "outputs", "percent", "phase", "place", "plan", "process", "program", "programs", "proof", "proofs", "question", "queue", "refusal", "request",
    "path", "instruction", "reader", "seconds", "sequence", "shape", "skills", "state", "step", "subject", "task", "tasks", "transcription", "url", "wait", "worker", "workers", "writes", "hint", "items", "hint", "then", "grant", "processor",
})
# Static driver instructions, runtime rule diagnostics and the words a managed hook, a foreign hook or a plugin step printed have no stored resource.
FOREIGN_TEMPLATES = frozenset({"OPENING_LINE", "RULE_FAILED", "MANAGED_HOOK_LINE", "AGENT_NOTICE"})

def source_files() -> list[Path]:
    return [path for folder in ("src/core", "src/suites") for path in (ROOT / folder).rglob("*.py")]


TYPES: dict[str, str] = {}


def declarations() -> list[tuple[str, str, Path]]:
    rows = []
    for path in source_files():
        tree = source_tree(path)
        for node in ast.walk(tree):
            is_declaration = isinstance(node, ast.Assign) and isinstance(node.value, ast.Call) and getattr(node.value.func, "id", "") == "NudgeDeclaration"
            if is_declaration and isinstance(node.value.args[2], ast.Constant):
                rows.append((node.targets[0].id, node.value.args[2].value, path))
                TYPES[node.targets[0].id] = getattr(node.value.args[1], "attr", "")
    return rows


DECLARATIONS = declarations()


def test_the_scan_finds_the_declared_lines():
    assert len(DECLARATIONS) > 100


@pytest.mark.parametrize("name,text,path", DECLARATIONS, ids=[row[0] for row in DECLARATIONS])
def test_a_steering_line_and_a_refusal_are_at_most_120_characters_and_only_info_may_be_longer(name, text, path):
    if TYPES[name] == "NOTICE":
        assert len(text) <= LONGEST_NOTICE_CHARACTERS, f"{name} is {len(text)} characters: {text}"
        return
    assert len(text) <= LONGEST_LINE_CHARACTERS, f"{name} is {len(text)} characters and is no info: {text}"


def test_every_declared_line_is_info_steering_or_a_refusal():
    assert set(TYPES.values()) <= {"NOTICE", "STEERING", "REFUSAL", "SAFETY_REFUSAL"}


@pytest.mark.parametrize("name,text,path", DECLARATIONS, ids=[row[0] for row in DECLARATIONS])
def test_a_line_carries_a_row_by_its_id_never_by_its_words(name, text, path):
    if name in FOREIGN_TEMPLATES:
        return
    if name == "TASK_METADATA_REMINDER":
        assert set(PLACEHOLDER.findall(text)) == {"task", "missing"}
        return
    if name == "TASK_HELPER_METADATA_REMINDER":
        assert set(PLACEHOLDER.findall(text)) == {"task", "missing"}
        return
    assert PLACEHOLDER.fullmatch(text) is None, f"{name} is only a placeholder, so its words are made on the fly: {text}"
    extra_fields = set(PLACEHOLDER.findall(text)) - ALLOWED_PLACEHOLDERS
    assert not extra_fields, f"{name} carries {extra_fields}: name the row as model:id, so the agent reads it by command"


@pytest.mark.parametrize("name,text,path", DECLARATIONS, ids=[row[0] for row in DECLARATIONS])
def test_every_line_is_in_a_register_of_its_module(name, text, path):
    if path.name == "rule_outcome.py":
        return
    module = next(parent for parent in path.parents if list(parent.glob("*_module.py")))
    module_sources = [source_text(source) for source in (module / "support").glob("*.py")] + [source_text(source) for source in module.glob("*_module.py")]
    registered = any(re.search(rf"(NUDGES = \[[^\]]*\b{name}\b|nudges = \[[^\]]*\b{name}\b)", file_text) for file_text in module_sources)
    assert registered, f"{name} of {path} is in no register"


def test_no_line_to_an_agent_is_written_on_the_fly():
    file_names = [path.name for path in source_files() if re.search(r'AgentLine\([^)]*text=f"', source_text(path))]
    assert not file_names, f"these write a line to an agent with no registered template: {file_names}"
