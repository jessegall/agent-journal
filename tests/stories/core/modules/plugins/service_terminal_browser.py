from core.modules.plugins.support.plugin_folders import PluginFolders
from tests.stories.core.modules.plugins.services import server_kept_story
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_running_service_shows_its_label_above_its_text_and_opens_its_terminal_on_a_click(new_story):
    story = server_kept_story(new_story)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    log = story.container.get(PluginFolders).service_log("served", "answers")
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("a") as output_file:
        output_file.write("answers service ready\n")
    try:
        with server_story(story) as server:
            expect_browser(server, "pluginServices.browser.mjs", [])
    finally:
        story.processes.close()
