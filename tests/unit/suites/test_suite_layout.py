import inspect
from pathlib import Path

from suites import DEFAULT_SUITES

SUITES_FOLDER = Path(inspect.getfile(DEFAULT_SUITES[0])).resolve().parents[1]


def expected_folder(module_name: str) -> Path:
    suite, *own_module = module_name.removeprefix("journal.suites.").split(".")
    return SUITES_FOLDER / suite / "modules" / own_module[0] if own_module else SUITES_FOLDER / suite


def test_every_suite_module_lives_in_its_suites_folder_and_a_suites_own_module_under_its_modules_folder():
    assert [module.folder() for module in DEFAULT_SUITES] == [expected_folder(module.name) for module in DEFAULT_SUITES]
