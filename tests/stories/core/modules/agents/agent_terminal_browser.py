import json

from engine.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_worker_and_helper_cards_show_their_own_terminal(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    story.expect_success('setting set journal.core.viewer.tour-completed true --project')
    worker = story.new_row_id(f'agent start terminal-worker claude worker --parent {story.agent.id} --environment main')
    helper = story.new_row_id(f'agent start terminal-helper claude helper --parent {story.agent.id} --environment main')
    story.expect_hook_allowed('terminal-worker', HookSamples.shell('ls worker-files', ShellPart('ls', CommandCategory.READ, ['worker-files'])))
    story.expect_hook_allowed('terminal-helper', HookSamples.shell('ls helper-files', ShellPart('ls', CommandCategory.READ, ['helper-files'])))
    rows = json.loads(story.run("usage agents --environment main --json", actor=story.user).output_text)["rows"]
    facts = {row["id"]: row["last_activity"] for row in rows}
    story.expect_rows(bool(facts[worker]), bool(facts[helper]))
    with server_story(story) as server:
        expect_browser(server, 'agentTerminal.browser.mjs', [str(worker), str(helper), str(tmp_path / 'agent-terminal')])
    print(f'Agent terminal screenshots: {tmp_path}')
