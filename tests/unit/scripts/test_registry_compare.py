import importlib.util
import json
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "scripts" / "move_check.py"
SPECIFICATION = importlib.util.spec_from_file_location("move_check", SCRIPT)
assert SPECIFICATION is not None and SPECIFICATION.loader is not None
script = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(script)

WINDOW = {"name": "coding.files", "module": "journal.suites.coding", "title": "Files", "entry": "files.js", "reads": ["file list"]}
SKILL = {"folder": "journal-shell", "module": "journal.core.processes", "description": "Run shell commands", "keywords": ["shell"], "types": ["main"]}
GROUP = {"key": "merger", "module": "journal.suites.coding", "label": "Merger", "agent_type": "merger", "profiles": []}
SUITE = {"name": "coding", "module": "journal.suites.coding", "windows": [], "layouts": {"home": {"windows": ["messages.chat"]}},
         "presets": {"home": [{"key": "focus", "name": "Focus", "text": "", "shape": {"windows": ["tasks.tasks"]}}]}}
REGISTRY = {"windows": [WINDOW], "skills": [SKILL], "agent_groups": [GROUP, {**GROUP, "key": "workers", "label": "Workers"}], "suites": [SUITE]}


def changed(**sorts: object) -> str:
    return json.dumps({**REGISTRY, **sorts})


def test_equal_registries_have_no_differences():
    assert script.registry_differences(json.dumps(REGISTRY), json.dumps(REGISTRY), {}) == []


def test_a_changed_window_field_names_the_sort_the_window_and_the_field():
    assert script.registry_differences(json.dumps(REGISTRY), changed(windows=[{**WINDOW, "title": "Changed files"}]), {}) == ["windows coding.files: title changed"]


def test_a_skill_with_a_changed_description_is_named():
    assert script.registry_differences(json.dumps(REGISTRY), changed(skills=[{**SKILL, "description": "Run commands"}]), {}) == ["skills journal-shell: description changed"]


def test_a_missing_agent_group_is_named():
    assert script.registry_differences(json.dumps(REGISTRY), changed(agent_groups=[GROUP]), {}) == ["agent_groups workers: missing"]


def test_a_field_the_conversion_may_drop_is_left_out_only_when_named():
    without_reads = changed(windows=[{key: value for key, value in WINDOW.items() if key != "reads"}])
    assert script.registry_differences(json.dumps(REGISTRY), without_reads, {}) == ["windows coding.files: reads changed"]
    assert script.registry_differences(json.dumps(REGISTRY), without_reads, {}, ["windows.reads"]) == []


def test_a_changed_preset_and_layout_are_named_by_suite_page_and_key():
    moved = {**SUITE, "layouts": {"home": {"windows": ["tasks.tasks"]}}, "presets": {"home": [{**SUITE["presets"]["home"][0], "name": "Quiet"}]}}
    assert script.registry_differences(json.dumps(REGISTRY), changed(suites=[moved]), {}) == ["layout coding/home: windows changed", "preset coding/home/focus: name changed"]
