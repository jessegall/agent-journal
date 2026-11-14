from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.modules.processes.support.cadence_probe import HelperBesideWorker, agent_run, worker_agent
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner

REPEATED_LINE = HookSamples.shell("make build fast", ShellPart("make", CommandCategory.UNKNOWN, ["build", "fast"])).with_fields(event="post_tool_use")
DOCK_WAIT = timedelta(seconds=10)
LARGE_OUTPUT = "x\n" * 150


def posted_read(line: str):
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="output")).with_fields(event="post_tool_use")


def test_a_helper_hears_the_alias_suggestion_and_the_shared_title_line_and_a_worker_the_read_advice(new_story):
    story = install_runner(new_story(fixture=HelperBesideWorker))
    helper, worker = helper_agent(story), worker_agent(story)
    for _ in range(8):
        agent_run(story, helper, "make build fast", CommandCategory.UNKNOWN)
    logs = agent_run(story, worker, "custom-logs run", CommandCategory.BUILD)
    end_run(story, logs, LARGE_OUTPUT)
    story.advance(DOCK_WAIT)
    helper_lines = "\n".join(story.hook(helper.session, REPEATED_LINE).lines)
    read = "\n".join(story.hook(worker.session, posted_read(f"journal output read {logs.id} --all")).lines)
    story.expect_rows("You ran make build fast 8 times" in helper_lines, "share one title" in helper_lines, f"Output {logs.id} has 150 lines" in read,
                      detail=f"{helper_lines}\n{read}")
