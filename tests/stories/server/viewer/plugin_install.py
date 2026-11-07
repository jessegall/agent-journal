from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story


def test_installing_a_plugin_from_the_plugins_page_answers_with_what_was_installed(new_story):
    story = new_story(fixture=UserJoined)
    folder = sample_plugin_folder(story.home.folder.parent)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        installed = server.viewer_line_value(cookie, {"window": "plugins.plugins", "environment": "main", "line": ["plugin", "install", str(folder), "--yes"]})
        story.expect_rows(installed == {"installed": True, "line": "installed sample, on", "name": "sample", "source": str(folder), "title": "Sample", "version": "1.0.0"})
