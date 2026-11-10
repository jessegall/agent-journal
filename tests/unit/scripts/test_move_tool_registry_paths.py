import importlib.util
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parents[3] / "scripts" / "move_class_file.py"
SPECIFICATION = importlib.util.spec_from_file_location("move_class_file_text", SCRIPT)
assert SPECIFICATION is not None and SPECIFICATION.loader is not None
script = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(script)

SOURCE = "src/core/former/sample_error.py"
TARGET = "src/engine/errors/sample_error.py"


def write(root, relative, text=""):
    path = root / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def moved(root):
    write(root, SOURCE, "class SampleError(Exception):\n    pass\n")
    return script.move_path(root, root / SOURCE, root / TARGET)


def test_a_snapshot_naming_the_class_path_is_rewritten(tmp_path):
    contract_file = write(tmp_path, "tests/snapshots/contract.json", '{"error": "core.former.sample_error:SampleError"}\n')
    moved(tmp_path)
    assert contract_file.read_text() == '{"error": "engine.errors.sample_error:SampleError"}\n'


def test_a_class_path_in_a_python_string_is_rewritten(tmp_path):
    importer = write(tmp_path, "src/core/user.py", 'PATH = "core.former.sample_error:SampleError"\n')
    moved(tmp_path)
    assert importer.read_text() == 'PATH = "engine.errors.sample_error:SampleError"\n'


def test_a_rule_of_the_commandments_folder_is_rewritten_by_module_and_by_file_path(tmp_path):
    rule = write(tmp_path, ".commandments/custom/rule.json", '{"module": "core.former.sample_error", "file": "src/core/former/sample_error.py"}\n')
    moved(tmp_path)
    assert rule.read_text() == '{"module": "engine.errors.sample_error", "file": "src/engine/errors/sample_error.py"}\n'


def test_a_longer_name_in_a_rule_is_left_alone(tmp_path):
    rule = write(tmp_path, ".commandments/custom/rule.json", '{"module": "core.former.sample_error_list"}\n')
    moved(tmp_path)
    assert rule.read_text() == '{"module": "core.former.sample_error_list"}\n'


def test_a_path_the_tool_does_not_understand_stops_the_move_and_is_named(tmp_path):
    rule = write(tmp_path, ".commandments/custom/rule.json", '{"fileMatches": "core/former/sample_error"}\n')
    write(tmp_path, SOURCE, "class SampleError(Exception):\n    pass\n")
    with pytest.raises(script.MoveError, match=".commandments/custom/rule.json"):
        script.move_path(tmp_path, tmp_path / SOURCE, tmp_path / TARGET)
    assert rule.read_text() == '{"fileMatches": "core/former/sample_error"}\n'


def test_a_recording_is_listed_and_not_rewritten(tmp_path):
    text = '{"path": "core.former.sample_error"}\n'
    recording = write(tmp_path, "tools/journal-hook/run/testdata/hooks.jsonl", text)
    report = moved(tmp_path)
    assert "not rewritten, a recording: tools/journal-hook/run/testdata/hooks.jsonl" in report
    assert recording.read_text() == text


def test_a_plugin_that_names_the_path_is_listed_and_not_rewritten(tmp_path):
    text = '{"reads": "core.former.sample_error"}\n'
    manifest = write(tmp_path, ".journal/plugins/sample/journal-plugin.json", text)
    report = moved(tmp_path)
    assert "not rewritten, a plugin: .journal/plugins/sample/journal-plugin.json" in report
    assert manifest.read_text() == text


def test_a_file_path_with_its_dot_escaped_for_a_regular_expression_is_rewritten_in_a_rule(tmp_path):
    write(tmp_path, SOURCE, "class SampleError(Exception):\n    pass\n")
    rule = write(tmp_path, ".commandments/custom/rule.json", '{"fileMatches": "(^|/)src/core/former/sample_error\\\\.py$"}\n')
    script.move_path(tmp_path, tmp_path / SOURCE, tmp_path / TARGET)
    assert rule.read_text() == '{"fileMatches": "(^|/)src/engine/errors/sample_error\\\\.py$"}\n'


def test_a_path_written_from_the_package_on_is_rewritten_in_a_rule_and_in_a_python_string(tmp_path):
    write(tmp_path, SOURCE, "class SampleError(Exception):\n    pass\n")
    rule = write(tmp_path, ".commandments/custom/rule.json", '{"rule": "only core/former/sample_error.py may raise it"}\n')
    importer = write(tmp_path, "src/core/user.py", 'SKIPPED_FILES = ("core/former/sample_error.py", "core/former/sample_error_list.py")\n')
    script.move_path(tmp_path, tmp_path / SOURCE, tmp_path / TARGET)
    assert rule.read_text() == '{"rule": "only engine/errors/sample_error.py may raise it"}\n'
    assert importer.read_text() == 'SKIPPED_FILES = ("engine/errors/sample_error.py", "core/former/sample_error_list.py")\n'
