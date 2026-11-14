import importlib.util
import json
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[3] / "scripts" / "move_check.py"
SPECIFICATION = importlib.util.spec_from_file_location("move_check", SCRIPT)
assert SPECIFICATION is not None and SPECIFICATION.loader is not None
script = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(script)

MOVES = {"core.former.sample": "engine.errors.sample"}


def test_a_registry_that_differs_only_in_the_moved_path_has_no_differences():
    recorded = json.dumps({"handlers": {"Run": "core.former.sample:Run"}})
    current = json.dumps({"handlers": {"Run": "engine.errors.sample:Run"}})
    assert script.registry_differences(recorded, current, MOVES) == []


def test_any_other_registry_change_is_named():
    recorded = json.dumps({"handlers": {"Run": "core.former.sample:Run"}, "guards": []})
    current = json.dumps({"handlers": {"Run": "engine.errors.sample:Run"}, "guards": ["extra"]})
    assert script.registry_differences(recorded, current, MOVES) == ["registry entry guards changed"]


def test_a_longer_module_name_is_not_taken_for_the_moved_one():
    recorded = json.dumps({"handlers": {"Run": "core.former.sample_list:Run"}})
    current = json.dumps({"handlers": {"Run": "engine.errors.sample_list:Run"}})
    assert script.registry_differences(recorded, current, MOVES) == ["registry entry handlers changed"]


def test_the_fingerprints_of_the_source_are_not_compared():
    assert script.registry_differences(json.dumps({"module_fingerprints": {"a": "1"}}), json.dumps({"module_fingerprints": {"a": "2"}}), {}) == []


def test_a_commit_of_import_and_path_lines_has_no_other_lines():
    diff = "--- a/x.py\n+++ b/x.py\n-from core.former.sample import A\n+from engine.errors.sample import A\n-PATH = \"core.former.sample:A\"\n+PATH = \"engine.errors.sample:A\"\n"
    assert script.non_move_lines(diff, ["core.former.sample", "engine.errors.sample"]) == []


def test_a_changed_class_body_line_is_named():
    diff = "--- a/x.py\n+++ b/x.py\n-    return 1\n+    return 2\n"
    assert script.non_move_lines(diff, ["core.former.sample"]) == ["-    return 1", "+    return 2"]


def test_a_failing_test_command_is_named_and_findings_of_the_judge_are_not():
    codes = {"pytest": 1, "journal": 1}
    assert script.failed_commands([("pytest", "a.py"), ("journal", "sins")], lambda command: codes[command[0]]) == ["pytest a.py"]


def test_a_judge_that_could_not_run_is_named():
    assert script.failed_commands([("journal", "sins")], lambda command: 3) == ["journal sins"]


def test_a_folder_in_the_middle_of_a_merge_is_named(tmp_path):
    idle, merging = tmp_path / "idle", tmp_path / "merging"
    idle.mkdir()
    merging.mkdir()
    (merging / "MERGE_HEAD").write_text("abc\n")
    assert script.folders_merging([idle, merging], lambda folder: folder / "MERGE_HEAD") == [merging]
