from pathlib import Path

import importlib.util

ROOT = Path(__file__).resolve().parents[4]
PINNED_MAP = "tests/snapshots/map.txt"
SURVEY_TABLE_HEADING = "| Area | Files tracked | Flat files | In folders | Folders | By sort | Most imported flat files |"


def test_442_the_registry_of_the_tree_read_twice_has_no_differences_and_names_no_removed_folder():
    move_check = script("move_check")
    first, second = move_check.registry_text(), move_check.registry_text()
    differences = move_check.registry_differences(first, second, {})
    assert differences == [], str(differences)
    assert 'core.base' not in first, str(differences)
    assert 'engine.change.' not in first, str(differences)


def script(name: str):
    specification = importlib.util.spec_from_file_location(name, ROOT / "scripts" / f"{name}.py")
    loaded = importlib.util.module_from_spec(specification)
    specification.loader.exec_module(loaded)
    return loaded
