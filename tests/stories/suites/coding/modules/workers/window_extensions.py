from engine.registry.registry import Registry
from server.viewer.module_files import ModuleFiles
from tests.stories.core.support.fixtures import UserJoined


def test_coding_supplies_the_agent_file_tab_as_a_served_module_component(new_story):
    story = new_story(fixture=UserJoined)
    window = story.container.get(Registry).window("agents.agents")
    tab = next(tab for tab in window.tabs if tab["key"] == "file-feed")
    module, entry = tab["component"].removeprefix("/modules/").split("/", 1)
    asset = ModuleFiles(story.home).file(module, entry)
    story.expect_rows(module == "journal.suites.coding")
    story.expect_rows(bool(asset.content))
    story.expect_rows(asset.content_type in ("text/javascript", "application/javascript"))


