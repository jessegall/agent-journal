import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CUSTOM_FOLDER = ROOT / ".commandments" / "custom"
ALLOW_LISTED_RULES = (
    "architecture_layout_base_loose_class", "architecture_layout_base_loose_function", "architecture_layout_base_loose_value",
    "architecture_layout_top_loose_class", "architecture_layout_top_loose_function", "architecture_layout_top_loose_value",
    "architecture_layout_error_outside_errors", "architecture_layout_enum_outside_enums", "architecture_layout_wrong_sort_in_kind_folder",
)


def stale_entries(rule, root):
    where_patterns = [step["fileMatches"] for step in rule["find"]["where"] if "fileMatches" in step]
    reject_patterns = [step["fileMatches"] for step in rule["find"]["reject"] if "fileMatches" in step]
    entries = [step["file"] for step in rule["find"]["reject"] if "file" in step]
    return [entry for entry in entries if not (root / entry).is_file() or not all(re.search(pattern, entry) for pattern in where_patterns) or any(re.search(pattern, entry) for pattern in reject_patterns)]


def sample_rule(*entries):
    return {"find": {"where": [{"fileMatches": r"^src/core/base/[^/]+\.py$"}], "reject": [{"fileMatches": r"__init__\.py$"}, *({"file": entry} for entry in entries)]}}


def test_a_listed_file_that_is_loose_is_a_valid_entry(tmp_path):
    (tmp_path / "src/core/base").mkdir(parents=True)
    (tmp_path / "src/core/base/clock.py").write_text("")
    assert stale_entries(sample_rule("src/core/base/clock.py"), tmp_path) == []


def test_a_listed_file_that_moved_is_a_stale_entry(tmp_path):
    assert stale_entries(sample_rule("src/core/base/clock.py"), tmp_path) == ["src/core/base/clock.py"]


def test_a_listed_file_in_a_folder_of_its_sort_is_a_stale_entry(tmp_path):
    (tmp_path / "src/core/base/time").mkdir(parents=True)
    (tmp_path / "src/core/base/time/clock.py").write_text("")
    assert stale_entries(sample_rule("src/core/base/time/clock.py"), tmp_path) == ["src/core/base/time/clock.py"]


def test_the_allow_lists_of_the_layout_rules_name_only_loose_files():
    stale = {name: stale_entries(json.loads((CUSTOM_FOLDER / f"{name}.json").read_text()), ROOT) for name in ALLOW_LISTED_RULES}
    assert {name: entries for name, entries in stale.items() if entries} == {}
