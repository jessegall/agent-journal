from engine.driver.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_agents_filter_menu_in_light_and_dark(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    worker = story.new_row_id(f"agent start filter-worker codex worker --parent {story.agent.id} --environment main")
    story.new_row_id(f"agent start filter-helper claude helper --parent {story.agent.id} --environment main")
    story.expect_hook_allowed("filter-worker", HookSamples.shell("ls worker", ShellPart("ls", CommandCategory.READ, ["worker"])))
    story.expect_hook_allowed("filter-helper", HookSamples.shell("ls helper", ShellPart("ls", CommandCategory.READ, ["helper"])))
    with server_story(story) as server:
        expect_browser(server, "agentFilters.browser.mjs", [str(worker), str(tmp_path / "agents-filter")])
