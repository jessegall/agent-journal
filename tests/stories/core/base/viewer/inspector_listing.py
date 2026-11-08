from server.viewer.windows_route import WindowsRoute
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.base.viewer.support.inspector_listing_modules import PATH
from tests.stories.core.base.viewer.support.inspector_modules import PATH as PLAIN_PATH
from tests.stories.core.support.fixtures import MainEnvironment


def inspectors_of(story):
    return {listing.noun: listing for listing in WindowsRoute(story.home).inspectors("main")}


def test_a_model_without_a_declaration_is_listed_with_the_default_inspector(new_story):
    task = inspectors_of(new_story(fixture=MainEnvironment))["pin"]
    assert (task.reads, task.label, task.title, task.description, task.width, task.components, task.comments, task.events) == ("pin show {row_id}", "", "{title}", "", "small", [], False, [])
    assert task.links == {"kinds": [], "open": False, "outside_plan": False, "page_size": 10}


def test_a_declared_inspector_is_listed_with_its_width_and_components(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:DeclaringModule")
    task = inspectors_of(story)["reminder"]
    assert (task.module, task.label, task.description, task.width, task.comments) == ("declaring", "Reminder {id}", "{text}", "large", True)
    assert task.components == [{"window": "declaring.chain", "tab": "Chain"}]


def test_a_row_with_a_shared_read_is_shareable(new_story):
    listed = inspectors_of(new_story(fixture=MainEnvironment))
    assert {noun: listed[noun].shareable for noun in ("plan", "doc", "task", "agent")} == {"plan": True, "doc": True, "task": False, "agent": False}


def test_an_inactive_module_lists_no_inspector(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    assert "file-edit" in inspectors_of(story)
    story.run("suite choose samples --environment main")
    assert "file-edit" not in inspectors_of(story)


def test_the_windows_list_is_unchanged(new_story):
    story = new_story(fixture=MainEnvironment)
    before = sorted(WindowsRoute(story.home).windows("main"), key=lambda window: window.name)
    story.expect_sync_success(f"{PLAIN_PATH}:InspectorModule")
    assert sorted(WindowsRoute(story.home).windows("main"), key=lambda window: window.name) == before


def test_an_inspector_lists_the_fields_of_its_row_only_when_it_declares_so(new_story):
    listed = inspectors_of(new_story(fixture=MainEnvironment))
    assert {noun: listed[noun].lists_fields for noun in ("agent", "task", "plan", "test-queue", "doc", "pin", "memory")} == {
        "agent": False, "task": False, "plan": False, "test-queue": False, "doc": False, "pin": True, "memory": True}


def test_an_inspector_whose_part_draws_the_text_says_so(new_story):
    listed = inspectors_of(new_story(fixture=MainEnvironment))
    assert {noun: listed[noun].draws_text for noun in ("doc", "report", "task", "memory")} == {"doc": True, "report": True, "task": False, "memory": False}
