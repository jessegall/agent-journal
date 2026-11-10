from suites.coding.coding_module import CodingModule
from suites.coding.coding_suite import CodingSuite


def test_a_suites_module_lives_in_its_suite_folder_and_is_named_after_it():
    assert CodingModule.__module__.startswith("suites.coding.") and CodingModule.name == "journal.suites.coding"
    assert CodingSuite.name == "coding" and CodingSuite.modules[0] is CodingModule
