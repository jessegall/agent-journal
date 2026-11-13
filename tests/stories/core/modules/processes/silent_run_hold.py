import os
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.processes.support.part_spec import PartSpec
from engine.testing.expectations.expect_reply import expect_reply_allowed
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.group_cpu_time import GroupCpuTime
from core.modules.processes.support.output_folder import OutputFolder
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from tests.stories.core.modules.processes.hang_watch import ActiveBuild, started_tree, watch_tick
from tests.stories.core.modules.processes.support.process_samples import end_run
from core.modules.processes.support.process_nudges import SILENT_RUN_HELD
from engine.testing.expectations.said_nudge import said

HANG_SECONDS = 300
TASK_LIST = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]))
READ_OUTPUT = HookSamples.shell("journal output read 1 --tail 5", ShellPart("journal", CommandCategory.JOURNAL, ["output", "read", "1", "--tail", "5"]))
EDIT = HookSamples.edit("src/shop.py")
SKIP_HOLD = HookSamples.shell("journal refusal skip processes.silent-run-hold --reason 'it writes to a file'",
                              ShellPart("journal", CommandCategory.JOURNAL, ["refusal", "skip", "processes.silent-run-hold", "--reason", "it writes to a file"]))
STOP_OUTPUT = HookSamples.shell("journal output stop 1", ShellPart("journal", CommandCategory.JOURNAL, ["output", "stop", "1"]))
HELD = "Output 1 printed nothing for 301s"


def print_line(story: Story, text: str) -> None:
    folder = story.container.get(OutputFolder)
    folder.write_start(1, "make build", ["make build"])
    folder.write_output(1, 1, text)
    printed_at = story.clock.timestamp().value.timestamp()
    os.utime(folder.home.folder / "processes" / "1" / "1.out", (printed_at, printed_at))


def silent_story(new_story, seconds: int = HANG_SECONDS + 1) -> Story:
    story = new_story(fixture=ActiveBuild)
    story.advance(timedelta(seconds=seconds))
    return story


def test_a_run_silent_for_the_hang_time_holds_the_next_tool_use_and_names_what_to_read(new_story):
    story = silent_story(new_story)
    story.expect_hook_refusal("s-1", EDIT, HELD)
    story.expect_hook_refusal("s-1", EDIT, said(SILENT_RUN_HELD, output=1, seconds=301, processor='not known', hint='read'))


def test_the_hold_says_the_processor_time_is_rising_when_it_moved_since_the_run_went_silent(new_story):
    story = new_story(fixture=ActiveBuild)
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=200))
    story.container.get(GroupCpuTime).used = 13.0
    watch_tick(story)
    story.advance(timedelta(seconds=HANG_SECONDS - 199))
    story.expect_hook_refusal("s-1", EDIT, "CPU time rising")


def test_a_held_agent_still_runs_journal_commands_and_the_skip_line_the_hold_names(new_story):
    story = silent_story(new_story)
    story.expect_hook_allowed("s-1", TASK_LIST)
    story.expect_hook_allowed("s-1", SKIP_HOLD)
    story.expect_hook_refusal("s-1", EDIT, HELD)


def test_a_run_read_before_it_went_silent_is_read_again_once_it_is_held(new_story):
    story = new_story(fixture=ActiveBuild)
    story.expect_success("output read 1 --tail 5", actor=story.agent)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", EDIT, HELD)
    story.expect_success("output read 1 --tail 5", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_reading_the_output_lets_the_next_tool_use_through_and_starts_the_silent_time_anew(new_story):
    story = silent_story(new_story, HANG_SECONDS + 6)
    story.expect_hook_allowed("s-1", READ_OUTPUT)
    story.expect_success("output read 1 --tail 5", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", EDIT, "printed nothing for 301s")


def test_stopping_the_run_lets_the_next_tool_use_through(new_story):
    story = silent_story(new_story, HANG_SECONDS + 4)
    story.expect_hook_allowed("s-1", STOP_OUTPUT)
    story.expect_success("output stop 1", actor=story.agent)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_run_that_ended_holds_nothing(new_story):
    story = silent_story(new_story, HANG_SECONDS + 5)
    end_run(story, story.container.get(ProcessQuery).find(1), "done\n")
    story.expect_hook_allowed("s-1", EDIT)


def test_a_run_that_prints_is_never_held(new_story):
    story = new_story(fixture=ActiveBuild)
    for number in range(3):
        story.advance(timedelta(seconds=200))
        print_line(story, f"step {number}\n")
        story.expect_hook_allowed("s-1", EDIT)


def test_a_held_read_only_helper_may_stop_and_read_its_own_run(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    actor = Actor(helper.id, ActorType.AGENT)
    parts = (PartSpec("grep cart a", "grep", False, CommandCategory.SEARCH),)
    bus = story.container.get(Bus)
    process = bus.run(StartProcess(helper.id, None, "grep cart a", "/work/helper", "zsh", CommandCategory.SEARCH, 15, parts), actor, environment_id=1)
    bus.run(StartProcessPart(process.id, 1), actor, environment_id=1)
    bus.run(MoveProcess(process.id), actor, environment_id=1)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    read = HookSamples.shell(f"journal output read {process.id} --tail 5", ShellPart("journal", CommandCategory.JOURNAL, ["output", "read", str(process.id), "--tail", "5"]))
    stop = HookSamples.shell(f"journal output stop {process.id}", ShellPart("journal", CommandCategory.JOURNAL, ["output", "stop", str(process.id)]))
    expect_reply_allowed(story.hook(helper.session, read))
    expect_reply_allowed(story.hook(helper.session, stop))
