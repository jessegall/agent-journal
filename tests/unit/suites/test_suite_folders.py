from core.suites.coding.module import CodingModule


def test_a_suites_module_lives_in_its_suite_folder_and_is_named_after_it():
    assert CodingModule.__module__.startswith("core.suites.coding.") and CodingModule.name == "journal.suites.coding"
    assert [suite.name for suite in CodingModule.suites] == ["coding"]
