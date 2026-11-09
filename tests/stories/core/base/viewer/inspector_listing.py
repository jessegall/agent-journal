from server.viewer.windows_route import WindowsRoute
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.base.viewer.support.inspector_listing_modules import PATH
from tests.stories.core.base.viewer.support.inspector_modules import PATH as PLAIN_PATH
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def read_inspectors(story):
    return {listing.noun: listing for listing in WindowsRoute(story.home).inspectors("main")}


def test_a_model_without_a_declaration_is_listed_with_the_default_inspector(new_story):
    task = read_inspectors(new_story(fixture=MainEnvironment))["pin"]
    expect_value((task.reads, task.label, task.title, task.description, task.width, task.components, task.comments, task.events), ("pin show {row_id}", "", "{title}", "", "small", [], False, []))
    expect_value(task.links, {"kinds": [], "open": False, "outside_plan": False, "page_size": 10})


def test_a_declared_inspector_is_listed_with_its_width_and_components(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:DeclaringModule")
    task = read_inspectors(story)["reminder"]
    expect_value((task.module, task.label, task.description, task.width, task.comments), ("declaring", "Reminder {id}", "{text}", "large", True))
    expect_value(task.components, [{"window": "declaring.chain", "tab": "Chain"}])


def test_a_row_with_a_shared_read_is_shareable(new_story):
    listed = read_inspectors(new_story(fixture=MainEnvironment))
    expect_value({model_name: listed[model_name].shareable for model_name in ("plan", "doc", "task", "agent")}, {"plan": True, "doc": True, "task": False, "agent": False})


def test_an_inactive_module_lists_no_inspector(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    expect_value("file-edit" in read_inspectors(story), True)
    story.run("suite choose samples --environment main")
    expect_value("file-edit" not in read_inspectors(story), True)


def test_the_windows_list_is_unchanged(new_story):
    story = new_story(fixture=MainEnvironment)
    previous = sorted(WindowsRoute(story.home).windows("main"), key=lambda window: window.name)
    story.expect_sync_success(f"{PLAIN_PATH}:InspectorModule")
    expect_value(sorted(WindowsRoute(story.home).windows("main"), key=lambda window: window.name), previous)


def test_an_inspector_lists_the_fields_of_its_row_only_when_it_declares_so(new_story):
    listed = read_inspectors(new_story(fixture=MainEnvironment))
    expect_value({model_name: listed[model_name].lists_fields for model_name in ("agent", "task", "plan", "test-queue", "doc", "pin", "memory")}, {
        "agent": False, "task": False, "plan": False, "test-queue": False, "doc": False, "pin": True, "memory": True})


def test_an_inspector_whose_part_draws_the_text_says_so(new_story):
    listed = read_inspectors(new_story(fixture=MainEnvironment))
    expect_value({model_name: listed[model_name].draws_text for model_name in ("doc", "report", "task", "plan", "memory")}, {"doc": True, "report": True, "task": True, "plan": True, "memory": False})
