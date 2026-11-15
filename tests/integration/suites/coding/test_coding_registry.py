from engine.registry.registry import Registry
from engine.registry.suite_windows import SuiteWindows
from suites.coding.coding_module import CodingModule
from suites.coding.coding_suite import CodingSuite
from suites.coding.entry_points.admin_entry_point import AdminEntryPoint
from suites.coding.windows.coding_windows import CODING_WINDOWS

ENTRY_POINT_SAMPLE_SUITE = "tests.stories.suites.coding.support.entrance_samples:FrontDeskSuite"
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
    assert kept.suite("sample-shop").entry_points["shop"] == ("sample-shop.stock", "messages.chat")


def test_the_coding_suite_lists_its_windows_in_the_admin_entry_point(journal):
    entry_points = dict(Registry.read(journal.database).suite(CodingSuite.name).entry_points)
    assert list(entry_points) == [AdminEntryPoint.key] and entry_points[AdminEntryPoint.key] == CodingSuite.offered_windows()


def test_a_second_entry_point_is_a_second_class_the_registry_reads_beside_the_admin_entry_point(journal):
    journal.expect_sync_success(ENTRY_POINT_SAMPLE_SUITE)
    entry_points = dict(Registry.read(journal.database).suite("front-desk").entry_points)
    assert list(entry_points) == [AdminEntryPoint.key, "review"] and entry_points["review"] == ("messages.chat", "tasks.tasks")


MENU_REMOVED = ("reviews.reviewer", "reviews.reviewers", "phone.phones", "usage.fitness", "suggestions.suggestions", "workers.models", "tunnel.tunnel", "tunler.account", "updates.updates", "templates.templates", "processes.output")
MENU_KEPT = ("drivers.hook-calls", "drivers.agent-messages", "sharing.shares", "triggers.triggers", "messages.attachments", "workers.points", "tasks.task-counts")


def offered_windows(journal):
    return SuiteWindows(Registry.read(journal.database)).windows("coding")


def test_the_coding_suite_offers_output_and_keeps_internal_renderers_private(journal):
    names = {window.name for window in offered_windows(journal)}
    assert "processes.output" in names and not {"questions.question", "viewer.shell"} & names


def test_agent_dropdowns_declare_that_they_need_one_agent(journal):
    registry = Registry.read(journal.database)
    for name in ("schedules.jobs", "usage.fitness", "usage.load"):
        window = registry.window(name)
        assert (window.loading, window.place, window.shows, window.shipped) == ("component", "dropdown", "one-agent", True)


def test_the_window_menu_of_the_coding_suite_lists_only_the_kept_windows(journal):
    offered = offered_windows(journal)
    menu = {window.name: window for window in offered if window.place not in ("bar", "page", "section")}
    assert not [name for name in MENU_REMOVED if name in menu] and all(name in menu for name in MENU_KEPT)
    assert menu["workers.points"].title == "Brief points"
    assert {"processes.output", "templates.templates", "updates.updates", "tunnel.tunnel"} <= {window.name for window in offered if window.place == "page"}
    assert "workers.models" not in {window.name for window in offered}
    assert {window.name: window.title for window in offered}["settings.project-hooks"] == "Hooks"
    assert {window.name: window.group for window in offered}["updates.updates"] == "footer"
