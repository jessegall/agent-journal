
from engine.enums.command_category import CommandCategory
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from core.modules.processes.nudges.sandbox_runner_missing_nudge import SandboxRunnerMissingNudge
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderHelper, BuilderStarted
from tests.stories.support.story_checks import expect_updated_input_reply

SERVER = HookSamples.shell("node serve.js", ShellPart("node", CommandCategory.PROCESS, ["serve.js"]))


# the slices the runner's policy, line and start effect are in, and safety under them: the other slices hold an agent
# that has not read its overview or its skills before any shell line runs


def runner_slices_on(story):
    return story


def test_with_the_runner_slices_on_the_new_driver_runs_a_shell_line_through_the_runner_with_its_process_row(played):
    story = runner_slices_on(install_runner(played(BuilderStarted)))
    reply = story.hook("s-1", SERVER)
    expect_updated_input_reply(reply, {"command": runner_line(story, 1, "node serve.js")})
    story.expect_success("process show 1", "line: node serve.js", "state: running", f"session_agent_id: {story.agent.id}")


def test_with_the_runner_slices_on_a_sandboxed_helper_is_refused_a_line_when_no_runner_is_installed(played):
    story = runner_slices_on(played(BuilderHelper))
    story.container.get(ShellSandbox).is_required = True
    reply = story.hook("sub-1", SERVER)
    story.expect_rows(SandboxRunnerMissingNudge.declared().nudge().text in reply.refusal, detail=reply.refusal)
    story.expect_refusal("process show 1", "no process 1")
