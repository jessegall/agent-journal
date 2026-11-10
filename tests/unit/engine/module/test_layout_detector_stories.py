import fnmatch
import json
import re
from pathlib import Path

import pytest

from tests.unit.test_layout_allow_list import ALLOW_LISTED_RULES, stale_entries

ROOT = Path(__file__).resolve().parents[4]
CUSTOM_FOLDER = ROOT / ".commandments" / "custom"
CLASS_RULE = "architecture_layout_base_loose_class"
FUNCTION_RULE = "architecture_layout_top_loose_function"
VALUE_RULE = "architecture_layout_top_loose_value"
ERROR_RULE = "architecture_layout_error_outside_errors"
ENUM_RULE = "architecture_layout_enum_outside_enums"
WRONG_SORT_RULE = "architecture_layout_wrong_sort_in_kind_folder"
ENUM_PARENT = "StrEnum"
ERROR_PARENT = "Exception"


def rule_file(name):
    return json.loads((CUSTOM_FOLDER / f"{name}.json").read_text())


def step_passes(step, path, parent):
    tests = {
        "fileMatches": lambda: re.search(step["fileMatches"], path) is not None,
        "file": lambda: step["file"] == path,
        "testCode": lambda: path.startswith("tests/"),
        "topLevel": lambda: True,
        "extendsAny": lambda: fnmatch.fnmatch(parent, step["extendsAny"]),
        "typeKind": lambda: parent == ENUM_PARENT,
        "any": lambda: any(step_passes(part, path, parent) for part in step["any"]),
        "all": lambda: all(step_passes(part, path, parent) for part in step["all"]),
        "not": lambda: not step_passes(step["not"], path, parent),
    }
    return tests[next(iter(step))]()


def flagged(name, path, parent="object"):
    find = rule_file(name)["find"]
    return all(step_passes(step, path, parent) for step in find["where"]) and not any(step_passes(step, path, parent) for step in find["reject"])


def rule_text(name):
    sin = rule_file(name)["sin"]
    return f"{sin['description']} {sin['rule']}"


def test_a_class_added_loose_in_the_engine_folder_is_refused_with_the_sorts_of_folder():
    assert flagged(CLASS_RULE, "src/engine/new_thing.py") and flagged(CLASS_RULE, "src/core/base/new_thing.py")
    assert "errors" in rule_text(CLASS_RULE) and "enums" in rule_text(CLASS_RULE)


def test_an_error_beside_a_class_outside_errors_is_refused():
    assert flagged(ERROR_RULE, "src/core/modules/tasks/support/copy_error.py", ERROR_PARENT)
    assert "errors folder" in rule_text(ERROR_RULE)


def test_an_enum_outside_enums_is_refused_and_a_plain_class_there_is_accepted():
    assert flagged(ENUM_RULE, "src/core/modules/tasks/models/task_state.py", ENUM_PARENT)
    assert not flagged(ENUM_RULE, "src/core/modules/tasks/models/task_row.py")
    assert "enums folder" in rule_text(ENUM_RULE)


@pytest.mark.parametrize("rule", [FUNCTION_RULE, VALUE_RULE])
def test_a_value_or_function_at_a_top_folder_is_refused(rule):
    assert flagged(rule, "src/server/address_values.py")


def test_a_module_file_at_a_top_folder_is_accepted():
    assert not flagged(VALUE_RULE, "src/tunnels/ssh_module.py") and not flagged(VALUE_RULE, "src/tunnels/ssh_suite.py")


def allow_listed(rule_name, entry):
    rule = rule_file(rule_name)
    rule["find"]["reject"] = [step for step in rule["find"]["reject"] if "file" not in step] + [{"file": entry}]
    return rule


def test_the_name_of_a_moved_file_left_in_the_allow_list_is_reported(tmp_path):
    assert stale_entries(allow_listed(CLASS_RULE, "src/core/base/sample_clock.py"), tmp_path) == ["src/core/base/sample_clock.py"]


def test_an_allow_listed_file_that_stopped_being_loose_is_reported(tmp_path):
    (tmp_path / "src/core/base/time").mkdir(parents=True)
    (tmp_path / "src/core/base/time/clock.py").write_text("")
    assert stale_entries(allow_listed(CLASS_RULE, "src/core/base/time/clock.py"), tmp_path) == ["src/core/base/time/clock.py"]


def test_a_class_of_the_wrong_sort_in_a_kind_folder_is_refused():
    assert flagged(WRONG_SORT_RULE, "src/engine/database/errors/plain_row.py")
    assert flagged(WRONG_SORT_RULE, "src/engine/database/enums/plain_value.py", ERROR_PARENT)
    assert not flagged(WRONG_SORT_RULE, "src/engine/database/errors/copy_error.py", ERROR_PARENT)
    assert not flagged(WRONG_SORT_RULE, "src/engine/database/enums/row_state.py", ENUM_PARENT)


def test_a_nested_errors_folder_is_accepted_and_a_folder_below_it_is_refused():
    assert not flagged(ERROR_RULE, "src/engine/database/errors/copy_error.py", ERROR_PARENT)
    assert flagged(ERROR_RULE, "src/engine/database/errors/helpers/copy_error.py", ERROR_PARENT)


@pytest.mark.parametrize("rule", ALLOW_LISTED_RULES)
def test_a_test_file_or_fixture_is_outside_the_rule(rule):
    assert not flagged(rule, "tests/stories/fixtures/copy_error.py", ERROR_PARENT)


@pytest.mark.parametrize("rule", ALLOW_LISTED_RULES)
def test_a_rule_judges_python_files_alone(rule):
    assert rule_file(rule)["engine"] == "python"


def test_the_refusal_of_a_loose_file_names_the_folders_it_goes_to():
    assert all(word in rule_text(CLASS_RULE) for word in ("errors", "enums", "models", "support"))


def test_the_refusal_of_an_error_file_names_the_target_folder():
    assert "Move x_error.py to the errors folder beside it" in rule_text(ERROR_RULE)


def test_a_file_in_its_area_folder_gets_no_layout_finding():
    assert not flagged(CLASS_RULE, "src/core/base/clock/clock.py") and not flagged(VALUE_RULE, "src/core/testing/support/clock_values.py")


@pytest.mark.parametrize("rule", ALLOW_LISTED_RULES)
def test_a_rule_narrows_to_a_file_path_ahead_of_reading_the_code(rule):
    assert any("fileMatches" in step for step in rule_file(rule)["find"]["where"])


@pytest.mark.parametrize("path", ["src/engine/__init__.py", "src/core/base/__init__.py"])
def test_a_package_file_is_accepted(path):
    assert not flagged(CLASS_RULE, path)


@pytest.mark.parametrize("path", ["src/viewer/dist/copy_error.py", "src/viewer/node_modules/copy_error.py", "src/core/vendor/copy_error.py"])
def test_build_output_is_accepted(path):
    assert not flagged(ERROR_RULE, path, ERROR_PARENT)
