import json
import shlex
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.triggers.trigger_details import AgentsEnableTriggers, RunSignal, extra_command_runner
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_command_file


def test_command_folder_and_printed_output_save_in_the_live_viewer(new_story, tmp_path):
    story = extra_command_runner(new_story(fixture=AgentsEnableTriggers))
    marker = RunSignal(tmp_path)
    command_folder = tmp_path / "chosen folder"
    command_folder.mkdir()
    actions = json.dumps([{"type": "run", "target": f"pwd > chosen.txt && {marker.command}"}])
    story.expect_success(f'trigger make cart "Mind the cart" --name "Cart check" --extra-actions {shlex.quote(actions)}', actor=story.agent)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_browser(server, "triggerDetails.browser.mjs", [str(command_folder), "/tmp/journal-worker-464-trigger-details.png"])
    story.hook("s-1", HookSamples.prompt("Fix the cart"))
    story.run_listeners()
    marker.wait()
    expect_command_file(command_folder, "chosen.txt", str(command_folder))
