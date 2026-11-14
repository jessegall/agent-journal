from engine.registry.registry import Registry
from suites.coding.coding_module import CodingModule
from suites.coding.windows.coding_windows import CODING_WINDOWS

SHAPE_SAMPLE_SUITE = "tests.stories.suites.coding.support.shape_samples:ShopSuite"


def test_the_registry_holds_what_each_coding_window_declares(journal):
    registered = {window.name: window for window in Registry.read(journal.database).windows}
    for window in CODING_WINDOWS:
        declared = window.declaration()
        assert (registered[window.name].title, registered[window.name].entry, tuple(registered[window.name].reads)) == (declared.title, declared.entry, tuple(declared.reads))


def test_the_registry_holds_every_window_skill_and_group_of_the_coding_module(journal):
    kept = Registry.read(journal.database)
    assert {window.name for window in CodingModule.window_declarations()} <= {window.name for window in kept.windows}
    assert {skill.folder for skill in CodingModule.skill_declarations()} <= {skill.folder for skill in kept.skills}
    assert {group.key for group in CodingModule.group_declarations()} <= {group.key for group in kept.agent_groups}


def test_a_sync_writes_the_same_registry_again(journal):
    saved = Registry.read(journal.database).entries_text()
    answer = journal.synced()
    assert answer.code == 0, answer.text
    assert Registry.read(journal.database).entries_text() == saved


def test_a_new_suite_written_in_the_coding_modules_shape_loads_and_registers(journal):
    journal.expect_sync_success(SHAPE_SAMPLE_SUITE)
    kept = Registry.read(journal.database)
    assert "sample-shop.stock" in {window.name for window in kept.windows}
    assert kept.suite("sample-shop").entrances["shop"] == ("sample-shop.stock", "messages.chat")
