from core.modules.processes.support.process_nudges import UPDATE_WAITING
from engine.testing.expectations.expected_nudge import expected_nudge
import json
import os
import subprocess

from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from engine.testing.examples.hook_samples import HookSamples
from engine.serving.server_files import ServerFiles
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.run_queue import expect_absent_slot, expect_slot, expect_waits, queued
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_hook_lines, install_runner
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents

VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
REMINDER_SECONDS = 5 * 60


def update_waiting_story(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    story.home.run_lock.write_text(str(os.getpid()))
    return story


def grant_slots(story) -> None:
    story.container.get(Bus).run(GrantRunSlots(), Actor.core())


def dead_process_id() -> int:
    ended = subprocess.Popen(["true"])
    ended.wait()
    return ended.pid


def test_a_waiting_update_holds_new_runs_in_the_queue_until_it_is_done(new_story):
    story = update_waiting_story(new_story)
    first, second = queued(story, "make one"), queued(story, "make two")
    expect_waits(story, first)
    expect_waits(story, second)
    story.home.run_lock.unlink()
    grant_slots(story)
    expect_slot(story, first)
    expect_slot(story, second)


def test_a_queued_run_whose_turn_comes_while_an_update_waits_goes_on_waiting(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    first, second, third = queued(story, "make one"), queued(story, "make two"), queued(story, "make three")
    story.home.run_lock.write_text(str(os.getpid()))
    end_run(story, first, "ok\n")
    grant_slots(story)
    expect_absent_slot(story, third)
    expect_waits(story, third)
    story.home.run_lock.unlink()
    grant_slots(story)
    expect_slot(story, third)


def test_a_run_that_holds_a_spot_goes_on_while_an_update_waits(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    first = queued(story, "make one")
    story.home.run_lock.write_text(str(os.getpid()))
    grant_slots(story)
    expect_slot(story, first)


def test_the_queue_resumes_in_order_with_the_runs_that_waited(new_story):
    story = update_waiting_story(new_story)
    first, second, third = queued(story, "make one"), queued(story, "make two"), queued(story, "make three")
    story.home.run_lock.unlink()
    grant_slots(story)
    expect_slot(story, first)
    expect_slot(story, second)
    expect_waits(story, third)


def test_a_wait_left_by_an_update_that_died_is_cleared_when_the_server_boots(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    story.home.run_lock.write_text(str(dead_process_id()))
    first = queued(story, "make one")
    expect_waits(story, first)
    ServerFiles(story.home).clear_dead_run_lock()
    grant_slots(story)
    expect_slot(story, first)


def test_a_wait_of_an_update_that_runs_is_not_cleared_when_the_server_boots(new_story):
    story = update_waiting_story(new_story)
    ServerFiles(story.home).clear_dead_run_lock()
    expect_waits(story, queued(story, "make one"))


def test_the_inspector_says_nothing_waits_for_an_update_once_it_is_done(new_story):
    story = update_waiting_story(new_story)
    story.home.run_lock.unlink()
    inspector = json.loads(story.run("queue inspect --environment 1 --json", actor=story.agent).output_text)
    story.expect_rows(not inspector["halted"], inspector["halt_cause"] == "")


def test_the_main_agent_is_told_an_update_waits_and_for_which_runs(new_story):
    story = update_waiting_story(new_story)
    running = queued(story, "make one")
    (story.home.folder / "processes" / str(running.id) / "pid").write_text(str(os.getpid()))
    (story.home.folder / "processes" / str(running.id) / "1.started").write_text("")
    lines = [line for line in ended_hook_lines(story, VIEW_LINE) if expected_nudge(UPDATE_WAITING).is_in(line)]
    story.expect_rows(len(lines) == 1, f"{running.id}" in lines[0], detail=str(lines))


def test_the_reminder_that_an_update_waits_comes_again_after_five_minutes_and_not_when_it_is_done(new_story):
    story = update_waiting_story(new_story)
    ended_hook_lines(story, VIEW_LINE)
    story.advance(timedelta(seconds=REMINDER_SECONDS + 1))
    story.expect_rows(len([line for line in ended_hook_lines(story, VIEW_LINE) if expected_nudge(UPDATE_WAITING).is_in(line)]) == 1)
    story.home.run_lock.unlink()
    story.advance(timedelta(seconds=REMINDER_SECONDS + 1))
    story.expect_rows(not [line for line in ended_hook_lines(story, VIEW_LINE) if expected_nudge(UPDATE_WAITING).is_in(line)])
