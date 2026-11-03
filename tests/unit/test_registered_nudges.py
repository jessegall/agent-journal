import ast
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
LONGEST_LINE_CHARACTERS = 120
PLACEHOLDER = re.compile(r"\{(\w+)\}")
NUDGE_LIST_NAMES = re.compile(r"NUDGES$")
# what a line may name: a row's number, a count, or a short fact that is no row's words
ALLOWED_PLACEHOLDERS = frozenset({
    "agent", "block", "branch", "category", "check", "count", "dump", "emoji", "environment", "folder", "job", "kept", "left", "lines", "memories", "memory", "message",
    "messages", "minutes", "name", "other", "outcome", "output", "outputs", "percent", "phase", "place", "plan", "process", "programs", "proofs", "question",
    "path", "reader", "result", "seconds", "sequence", "shape", "skills", "state", "step", "subject", "task", "tasks", "transcription", "url", "wait", "worker", "writes", "items",
})
# whole lines that come from outside the journal's own words: a plugin's, a trigger the user wrote, a driver's declared opening, a rule's failure
FOREIGN_TEMPLATES = frozenset({"REMINDER_LINE", "REMINDER_BLOCK", "PLUGIN_LINE", "PLUGIN_REFUSAL", "TRIGGER_LINE", "TRIGGER_DENIES", "OPENING_LINE", "RULE_FAILED"})
# a worker's job and the words a person or an agent sends it, passed on as file_names
PASSED_ON_LINES = ("send_worker_handler.py", "short_proof_handler.py", "ended_worker_listener.py", "worker_resume.py", "merge_worker_handler.py",
                   "record_bypass_line_handler.py", "record_hook_call_handler.py", "new_driver_lines_listener.py")

def source_files() -> list[Path]:
    return [path for folder in ("src/core", "src/suites") for path in (ROOT / folder).rglob("*.py")]


def declarations() -> list[tuple[str, str, Path]]:
    rows = []
    for path in source_files():
        tree = ast.parse(path.read_text())
        for node in ast.walk(tree):
            is_declaration = isinstance(node, ast.Assign) and isinstance(node.value, ast.Call) and getattr(node.value.func, "id", "") == "NudgeDeclaration"
            if is_declaration and isinstance(node.value.args[2], ast.Constant):
                rows.append((node.targets[0].id, node.value.args[2].value, path))
    return rows


DECLARATIONS = declarations()


def test_the_scan_finds_the_declared_lines():
    assert len(DECLARATIONS) > 100


@pytest.mark.parametrize("name,text,path", DECLARATIONS, ids=[row[0] for row in DECLARATIONS])
def test_a_line_is_at_most_120_characters(name, text, path):
    assert len(text) <= LONGEST_LINE_CHARACTERS, f"{name} is {len(text)} characters: {text}"


@pytest.mark.parametrize("name,text,path", DECLARATIONS, ids=[row[0] for row in DECLARATIONS])
def test_a_line_carries_a_row_by_its_id_never_by_its_words(name, text, path):
    if name in FOREIGN_TEMPLATES:
        return
    assert PLACEHOLDER.fullmatch(text) is None, f"{name} is only a placeholder, so its words are made on the fly: {text}"
    extra_fields = set(PLACEHOLDER.findall(text)) - ALLOWED_PLACEHOLDERS
    assert not extra_fields, f"{name} carries {extra_fields}: name the row as model:id, so the agent reads it by command"


@pytest.mark.parametrize("name,text,path", DECLARATIONS, ids=[row[0] for row in DECLARATIONS])
def test_every_line_is_in_a_register_of_its_module(name, text, path):
    module_sources = [source.read_text() for source in path.parent.glob("*.py")] + [source.read_text() for source in path.parents[1].glob("*_module.py")]
    registered = any(re.search(rf"(NUDGES = \[[^\]]*\b{name}\b|nudges = \[[^\]]*\b{name}\b)", text_of_file) for text_of_file in module_sources)
    assert registered or path.name == "rule_outcome.py", f"{name} of {path} is in no register"


def test_no_line_to_an_agent_is_written_on_the_fly():
    file_names = [path.name for path in source_files() if re.search(r'AgentLine\([^)]*text=f"', path.read_text()) and path.name not in PASSED_ON_LINES]
    assert not file_names, f"these write a line to an agent with no registered template: {file_names}"
