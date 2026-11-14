from pathlib import Path
import subprocess

import importlib.util

ROOT = Path(__file__).resolve().parents[4]
PINNED_MAP = "tests/snapshots/map.txt"
SURVEY_TABLE_HEADING = "| Area | Files tracked | Flat files | In folders | Folders | By sort | Most imported flat files |"


def script(name: str):
    specification = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    loaded = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(loaded)
    return loaded


def test_453_the_map_is_a_tracked_file_whose_changes_show_in_a_diff_and_the_survey_prints_its_table():
    tracked = subprocess.run(["git", "ls-files", PINNED_MAP], capture_output=True, text=True, cwd=ROOT, check=True).stdout.split()
    survey_lines = script("flat_area_survey").FlatAreaSurvey().lines()
    area_rows = [line for line in survey_lines if line.startswith("| ") and line != SURVEY_TABLE_HEADING]
    assert tracked == [PINNED_MAP], str(survey_lines[:4])
    assert SURVEY_TABLE_HEADING in survey_lines, str(survey_lines[:4])
    assert any((line.startswith('| module | ') for line in area_rows)), str(survey_lines[:4])
