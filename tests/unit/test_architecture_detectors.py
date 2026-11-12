import json
import re
import subprocess
from collections.abc import Iterator
from pathlib import Path

import pytest
from tests.unit.support.commandments_config import commandments_config

ROOT = Path(__file__).resolve().parents[2]
CUSTOM_FOLDER = ROOT / ".commandments" / "custom"
KNOWN_WITHOUT_SAMPLE = ROOT / "tests" / "snapshots" / "detectors_without_sample.txt"
KNOWN_MISSING_FOLDERS = ROOT / "tests" / "snapshots" / "detector_folders_missing.txt"
KNOWN_MISSING_SAMPLE_FOLDERS = ROOT / "tests" / "snapshots" / "detector_sample_folders_missing.txt"
DETECTORS = sorted(path.stem for path in CUSTOM_FOLDER.glob("architecture_*.json"))
PATH_KEYS = ("file", "fileMatches", "calledFrom")
PATTERN_START = re.compile(r"^(\(\^\|/\)|\^|\*\*/|/)+")
FIRST_PATTERN_CHARACTER = re.compile(r"[\[\](){}*+?\\^$|.]")


def detector(name: str) -> dict:
    return json.loads((CUSTOM_FOLDER / f"{name}.json").read_text())


def sample_text() -> str:
    return "\n".join(path.read_text(errors="ignore") for path in sorted((CUSTOM_FOLDER / "samples").rglob("*")) if path.is_file())


def tracked_paths() -> list[str]:
    listed = subprocess.run(["git", "ls-files"], capture_output=True, text=True, cwd=ROOT, check=True).stdout.splitlines()
    return [f"/{line}" for line in listed if not line.startswith(".commandments/")]


def path_patterns(step: object) -> Iterator[str]:
    if isinstance(step, dict):
        for key, value in step.items():
            if key in PATH_KEYS and isinstance(value, str):
                yield value
            else:
                yield from path_patterns(value)
    if isinstance(step, list):
        for part in step:
            yield from path_patterns(part)


def literal_folder(pattern: str) -> str:
    text = PATTERN_START.sub("", pattern)
    match = FIRST_PATTERN_CHARACTER.search(text)
    literal = text if match is None else text[:match.start()]
    return literal.rpartition("/")[0]


def folders_of(name: str) -> list[str]:
    return sorted({folder for pattern in path_patterns(detector(name)["find"]) if (folder := literal_folder(pattern))})


def missing_folder_lines() -> list[str]:
    paths = tracked_paths()
    return sorted(f"{name}: {folder}" for name in DETECTORS for folder in folders_of(name) if not any(f"/{folder}/" in path for path in paths))


def lines_without_sample() -> list[str]:
    text = sample_text()
    return [name for name in DETECTORS if f"@sin {name}\n" not in text or f"@righteous {name}\n" not in text]


def configuration() -> dict:
    return commandments_config(ROOT)


def sample_folders_missing() -> list[str]:
    owners = set()
    for path in (CUSTOM_FOLDER / "samples").rglob("*.py"):
        parts = path.relative_to(CUSTOM_FOLDER / "samples").parts
        if "src" not in parts:
            continue
        below = parts[parts.index("src") + 1:-1]
        if list(below[:1]) == ["engine"] and len(below) > 1:
            owners.add(f"src/engine/{below[1]}")
        if below[:2] == ("core", "modules") and len(below) > 2:
            owners.add(f"src/core/modules/{below[2]}")
        if list(below[:1]) == ["suites"] and len(below) > 1:
            owners.add(f"src/suites/{below[1]}")
    return sorted(owner for owner in owners if not (ROOT / owner).is_dir())


def known(path: Path) -> list[str]:
    return path.read_text().splitlines()


@pytest.mark.parametrize("name", DETECTORS)
def test_an_architecture_detector_loads_and_says_what_it_flags_and_how_to_fix_it(name):
    rule = detector(name)
    assert rule["engine"] and ("select" in rule["find"] or "from" in rule["find"])
    assert rule["sin"]["name"] and rule["sin"]["description"] and rule["sin"]["rule"]


def test_every_architecture_detector_has_a_refused_sample_and_an_accepted_sample():
    added = sorted(set(lines_without_sample()) - set(known(KNOWN_WITHOUT_SAMPLE)))
    assert added == [], "write a sample with a line '@sin <detector>' and a line '@righteous <detector>' under .commandments/custom/samples"


def test_a_detector_that_got_its_samples_is_taken_off_the_known_list():
    assert sorted(set(known(KNOWN_WITHOUT_SAMPLE)) - set(lines_without_sample())) == []


def test_every_folder_a_detector_names_exists_in_the_checkout():
    added = sorted(set(missing_folder_lines()) - set(known(KNOWN_MISSING_FOLDERS)))
    assert added == [], "a detector names a folder that is gone: a moved folder switches the detector off, so update its pattern"


def test_a_detector_folder_that_exists_again_is_taken_off_the_known_list():
    assert sorted(set(known(KNOWN_MISSING_FOLDERS)) - set(missing_folder_lines())) == []


def test_the_literal_folder_of_a_pattern_is_what_stands_before_its_first_pattern_character():
    assert literal_folder("(^|/)src/engine/testing/") == "src/engine/testing"
    assert literal_folder("src/core/modules/*/rules/*.py") == "src/core/modules"
    assert literal_folder("(^|/)engine/driver/[^/]+\\.py$") == "engine/driver"
    assert literal_folder("*Repository.py") == ""


def test_every_detector_file_is_listed_in_the_configuration_so_the_judge_runs_it():
    files = sorted(path.stem for path in CUSTOM_FOLDER.glob("*.json") if path.stem != "lists")
    assert [name for name in files if name not in configuration()["detectors"]] == []


def test_every_top_folder_of_the_source_is_judged():
    top_folders = sorted(f"src/{folder.name}" for folder in (ROOT / "src").iterdir() if folder.is_dir() and folder.name != "__pycache__")
    assert [folder for folder in top_folders if folder not in configuration()["paths"]] == []


def test_a_sample_that_mirrors_an_engine_area_a_core_module_or_a_suite_names_one_that_exists():
    added = sorted(set(sample_folders_missing()) - set(known(KNOWN_MISSING_SAMPLE_FOLDERS)))
    assert added == [], "the area, module or suite of a sample is gone: move the sample with the source it mirrors"


def test_a_sample_folder_that_exists_again_is_taken_off_the_known_list():
    assert sorted(set(known(KNOWN_MISSING_SAMPLE_FOLDERS)) - set(sample_folders_missing())) == []
