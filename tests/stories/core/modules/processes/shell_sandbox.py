from engine.sandbox.shell_sandbox import ShellSandbox
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from engine.driver.command_category import CommandCategory
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.modules.processes.support.process_samples import runner_line, expect_rewritten


def test_a_run_keeps_its_sandbox_level(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "cat notes.txt")
    story.expect_text(f"process sandbox {process.id} --level macos-sandbox", "updated:", actor=story.agent)
    story.expect_text(f"process show {process.id}", "sandbox_level: macos-sandbox")


def test_a_helpers_shell_is_sandboxed(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.container.get(ShellSandbox).is_required = True
    story.run(f"agent start helper-1 claude helper --parent {story.agent.id} --environment main")
    reply = story.hook("helper-1", HookSamples.shell("cat notes.txt", ShellPart("cat", CommandCategory.READ, ["notes.txt"])))
    expect_rewritten(reply, runner_line(story, 1, "cat notes.txt", session="helper-1", read_command=True, sandbox=True))
