import importlib.util
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PINNED_MAP = "tests/snapshots/map.txt"
SURVEY_TABLE_HEADING = "| Area | Files tracked | Flat files | In folders | Folders | By sort | Most imported flat files |"


def script(name: str):
    specification = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    loaded = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(loaded)
    return loaded


def test_442_the_registry_of_the_tree_read_twice_has_no_differences_and_names_no_removed_folder(new_story):
    story = new_story()
    move_check = script("move_check")
    first, second = move_check.registry_text(), move_check.registry_text()
    differences = move_check.registry_differences(first, second, {})
    story.expect_rows(differences == [], "core.base" not in first, "engine.change." not in first, detail=str(differences))


def test_453_the_map_is_a_tracked_file_whose_changes_show_in_a_diff_and_the_survey_prints_its_table(new_story):
    story = new_story()
    tracked = subprocess.run(["git", "ls-files", PINNED_MAP], capture_output=True, text=True, cwd=ROOT, check=True).stdout.split()
    survey_lines = script("flat_area_survey").FlatAreaSurvey().lines()
    area_rows = [line for line in survey_lines if line.startswith("| ") and line != SURVEY_TABLE_HEADING]
    story.expect_rows(tracked == [PINNED_MAP], SURVEY_TABLE_HEADING in survey_lines, any(line.startswith("| module | ") for line in area_rows), detail=str(survey_lines[:4]))
