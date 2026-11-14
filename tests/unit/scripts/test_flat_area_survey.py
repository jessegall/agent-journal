import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SPECIFICATION = importlib.util.spec_from_file_location("flat_area_survey", ROOT / "scripts" / "flat_area_survey.py")
flat_area_survey = importlib.util.module_from_spec(SPECIFICATION)
SPECIFICATION.loader.exec_module(flat_area_survey)


def test_357_the_survey_lists_every_area_folder_of_the_engine():
    survey = flat_area_survey.FlatAreaSurvey()
    on_disk = sorted(folder.name for folder in (ROOT / "src" / "engine").iterdir() if folder.is_dir() and any(path.name != "__init__.py" for path in folder.rglob("*.py")))
    assert survey.area_names() == on_disk


def test_357_the_survey_counts_each_engine_file_once():
    survey = flat_area_survey.FlatAreaSurvey()
    tracked = [path for path in flat_area_survey.tracked_files("src/engine") if path.name != "__init__.py"]
    assert sum(len(survey.area_files(area)) for area in survey.area_names()) == len(tracked)
