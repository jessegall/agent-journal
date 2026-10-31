from core.modules import DEFAULT_MODULES
from core.suites.coding.module import CodingModule


def test_a_suites_module_lives_in_its_suite_folder_is_named_after_it_and_is_installed_by_default():
    assert CodingModule.__module__.startswith("core.suites.coding.") and CodingModule.name == "journal.suites.coding"
    assert CodingModule in DEFAULT_MODULES and [suite.name for suite in CodingModule.suites] == ["coding"]
