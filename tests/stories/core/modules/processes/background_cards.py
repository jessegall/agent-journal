import json
from datetime import timedelta

import pytest

from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_nudges import RUN_NAME, SHARED_TITLE
from tests.stories.core.modules.processes.support.cadence_probe import side_run
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, started_run
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.support.story_checks import expect_value_line

MARKS = "chat-mark list --environment 1 --oldest"
NEWEST_MARKS = "chat-mark list --environment 1"
DOCK = "dock-item list --environment 1"
SCRIPT = "python3 scratch.py"
READ = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
DOCK_SECONDS = timedelta(seconds=6)
FOREGROUND_SECONDS = timedelta(seconds=16)


def moved(story: Story, process: Process) -> Process:
    """The run sent to the background, as the runner reports it."""
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    story.run_listeners()
    return process


def docked(story: Story, session: str = "s-1") -> list[str]:
    """The agent stops, the dock seconds pass, and its next hooks, a stop and a tool use, dock a long run: the
    lines said at those hooks."""
    story.hook(session, HookSamples.stop())
    story.advance(DOCK_SECONDS)
    lines = [*story.hook(session, HookSamples.stop()).lines, *story.hook(session, READ).lines]
    story.run_listeners()
    return lines


@pytest.fixture
def main_story(new_story) -> Story:
    return install_runner(new_story(fixture=UserBuilder))


def test_a_process_run_that_moves_to_the_background_gets_its_mark_at_the_move(main_story):
    process = started_run(main_story, "./tools/serve-docs", CommandCategory.PROCESS)
    main_story.run_listeners()
    main_story.expect_absent(MARKS, f"process:{process.id}", actor=main_story.user)
    moved(main_story, process)
    main_story.expect_text(MARKS, "processes.command", f"process:{process.id}", actor=main_story.user)


def test_a_background_script_is_docked_asked_for_a_title_once_and_its_mark_ends_with_it(main_story):
    process = moved(main_story, started_run(main_story, SCRIPT, CommandCategory.PROCESS))
    expect_value_line(docked(main_story), RUN_NAME.nudge(process=process.id).text)
    main_story.expect_text(DOCK, "processes.output", actor=main_story.user)
    main_story.expect_success(f'output title {process.id} "Serving the docs"', actor=main_story.agent)
    main_story.expect_rows(not any("has its raw command as its title" in line for line in main_story.hook("s-1", READ).lines))
    end_run(main_story, process, "done\n")
    main_story.run_listeners()
    main_story.expect_text(NEWEST_MARKS, f"process:{process.id}", "ended", actor=main_story.user)


def test_a_helpers_background_run_gets_the_card_and_the_title_ask(new_story):
    story = install_runner(new_story(fixture=ForcedReaders))
    worker = reader_worker(story)
    process = worker_run(story, "python3 build_site.py", CommandCategory.BUILD)
    story.container.get(Bus).run(MoveProcess(process.id), worker, environment_id=1)
    lines = docked(story, "s-reader")
    story.expect_text(MARKS, f"process:{process.id}", actor=story.user)
    expect_value_line(lines, RUN_NAME.nudge(process=process.id).text)


def test_a_run_moved_by_the_foreground_limit_keeps_its_card_and_its_title_ask(main_story):
    process = started_run(main_story, "python3 build_site.py", CommandCategory.BUILD)
    main_story.advance(FOREGROUND_SECONDS)
    main_story.run(f"process background {process.id}", actor=main_story.agent)
    lines = docked(main_story)
    main_story.expect_text(MARKS, f"process:{process.id}", actor=main_story.user)
    main_story.expect_text(DOCK, "processes.output", actor=main_story.user)
    expect_value_line(lines, RUN_NAME.nudge(process=process.id).text)


def test_a_read_that_moved_a_quick_read_and_a_plugin_run_never_show_a_card(main_story):
    quick = started_run(main_story, "cat small.log", CommandCategory.READ)
    end_run(main_story, quick, "line\n")
    slow = moved(main_story, started_run(main_story, "grep -r cart logs", CommandCategory.SEARCH))
    docked(main_story)
    main_story.expect_absent(MARKS, f"process:{slow.id}", actor=main_story.user)
    main_story.expect_absent(MARKS, f"process:{quick.id}", actor=main_story.user)
    plugin = side_run(main_story, main_story.agent, "make lint", CommandCategory.CHECK, plugin="sample")
    docked(main_story)
    main_story.expect_absent(MARKS, f"process:{plugin.id}", actor=main_story.user)


def test_the_open_list_shows_a_background_run_that_the_running_state_leaves_out(main_story):
    process = moved(main_story, started_run(main_story, "make bundle", CommandCategory.BUILD))
    main_story.expect_text("process list --open --columns id,state --environment main", "background", actor=main_story.user)
    main_story.expect_absent("process list --state running --columns id,state --environment main", "background", actor=main_story.user)
    queue = json.loads(main_story.run("queue list --environment 1 --json", actor=main_story.user).output_text)
    main_story.expect_rows([row["id"] for row in queue["running"]] == [process.id], detail=json.dumps(queue)[:300])


@pytest.mark.parametrize("end", ["finished", "failed", "stopped"])
def test_the_card_of_a_background_run_ends_in_place_with_the_run(main_story, end):
    process = moved(main_story, started_run(main_story, SCRIPT, CommandCategory.PROCESS))
    if end == "stopped":
        main_story.expect_success(f"output stop {process.id} --environment main", actor=main_story.user)
    else:
        end_run(main_story, process, "done\n", exit_code=0 if end == "finished" else 1)
    main_story.run_listeners()
    marks = main_story.run(NEWEST_MARKS, actor=main_story.user).output_text
    main_story.expect_rows(marks.count(f"process:{process.id}") == 1 and "ended" in marks, detail=marks)


def test_a_process_script_is_not_refused_as_a_command_of_unknown_type(main_story):
    main_story.expect_hook_allowed("s-1", HookSamples.shell("./tools/serve-docs", ShellPart("./tools/serve-docs", CommandCategory.PROCESS, [])))


def test_two_background_runs_with_one_title_are_asked_to_take_their_own(main_story):
    first = moved(main_story, started_run(main_story, "make bundle", CommandCategory.BUILD))
    second = moved(main_story, started_run(main_story, "make docs", CommandCategory.BUILD))
    for process in (first, second):
        main_story.expect_success(f'output title {process.id} "Building the viewer"', actor=main_story.agent)
    expect_value_line(docked(main_story), SHARED_TITLE.nudge(outputs=f"{first.id}, {second.id}").text)
