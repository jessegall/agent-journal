import inspect
from pathlib import Path

from suites import DEFAULT_SUITES

SUITES_FOLDER = Path(inspect.getfile(DEFAULT_SUITES[0])).resolve().parents[1]


def test_every_suite_module_lives_in_its_own_folder_under_src_suites():
    assert [module.folder() for module in DEFAULT_SUITES] == [SUITES_FOLDER / module.name.rsplit(".", 1)[1] for module in DEFAULT_SUITES]
