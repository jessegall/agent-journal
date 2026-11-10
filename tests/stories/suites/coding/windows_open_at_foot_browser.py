from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment

ROWS = 60


def test_the_terminal_and_the_file_feed_open_at_their_bottom(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    repository = repository_environment(story)
    worker = story.new_row_id(f"agent start terminal-worker claude worker --parent {story.agent.id} --environment main")
    for number in range(ROWS):
        story.expect_hook_allowed("terminal-worker", HookSamples.shell(f"ls folder-{number}", ShellPart("ls", CommandCategory.READ, [f"folder-{number}"])))
        scanned_edit(story, "s-1", f"file_{number}.py", 1, 0, folder=repository.folder)
    with server_story(story) as server:
        expect_browser(server, "windowsOpenAtFoot.browser.mjs", [str(worker), str(story.agent.id)])
