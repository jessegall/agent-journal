from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.base.module.module_finder import ModuleFinder
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.run_queue import has_slot, queued, waits, expect_absent_slot, expect_absent_waits, expect_slot, expect_waits
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents as BuilderStarted
from tests.stories.support.story_checks import expect_value_with
from core.modules.processes.support.output_folder import OutputFolder

VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))
HALT = 'queue halt "a deploy is going"'
REMINDER = "the process queue is halted"
REMINDER_SECONDS = 5 * 60


def halted_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success(HALT, actor=story.agent)
    return story


def reminders(story) -> list[str]:
    return [line for line in story.hook("s-1", VIEW_LINE).lines if REMINDER in line]


def test_work_can_still_join_a_halted_queue_and_waits_there(new_story):
    story = halted_story(new_story)
    first, second = queued(story, "make one"), queued(story, "make two")
    expect_waits(story, first)
    expect_waits(story, second)
    expect_absent_slot(story, first)


def test_nothing_starts_while_the_queue_is_halted_not_even_when_a_spot_frees(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    first, second, third = queued(story, "make one"), queued(story, "make two"), queued(story, "make three")
    story.expect_success(HALT, actor=story.agent)
    end_run(story, first, "ok\n")
    expect_absent_slot(story, third)
    expect_waits(story, third)


def test_runs_already_holding_a_spot_go_on_while_the_queue_is_halted(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    first = queued(story, "make one")
    story.expect_success(HALT, actor=story.agent)
    expect_slot(story, first)
    expect_absent_waits(story, first)
    end_run(story, first, "ok\n")


def test_resuming_grants_the_spots_oldest_first(new_story):
    story = halted_story(new_story)
    first, second, third = queued(story, "make one"), queued(story, "make two"), queued(story, "make three")
    story.expect_success("queue resume", actor=story.agent)
    expect_slot_3(story, first, second, third, (True, True, False))


def test_a_slot_timeout_ends_failed_and_resuming_only_admits_a_new_retry(new_story):
    story = halted_story(new_story)
    expired = queued(story, "make timed-out")
    story.advance(timedelta(minutes=30))
    expect_absent_slot(story, expired)
    message = "queue slot wait expired: no command was started\n"
    story.container.get(OutputFolder).write_output(expired.id, 1, message)
    story.expect_success(f"process end {expired.id} --exit-code 124 --bytes {len(message)} --lines 1", actor=Actor(expired.session_agent_id, ActorType.AGENT))
    story.expect_text(f"process show {expired.id}", "state: failed", "exit_code: 124")
    story.expect_success("queue resume", actor=story.agent)
    expect_absent_slot(story, expired)
    retry = queued(story, "make retry")
    expect_slot(story, retry)


def test_a_cancelled_queued_run_never_receives_a_slot_when_the_queue_resumes(new_story):
    story = halted_story(new_story)
    cancelled = queued(story, "make cancelled")
    story.expect_success(f"output stop {cancelled.id}", actor=story.agent)
    story.expect_success("queue resume", actor=story.agent)
    expect_absent_slot(story, cancelled)
    story.expect_text(f"process show {cancelled.id}", "state: stopped")
    expect_slot(story, queued(story, "make fresh"))


def test_resuming_a_queue_that_is_not_halted_says_so(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_refusal("queue resume", "is not halted", actor=story.agent)


def test_a_restart_holds_the_queue_and_releases_it_by_itself_when_the_restart_is_done(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.home.restart_mark.write_text("1")
    first, second = queued(story, "make one"), queued(story, "make two")
    expect_waits(story, first)
    expect_waits(story, second)
    story.home.restart_mark.unlink()
    story.container.get(Bus).run(GrantRunSlots(), Actor.core())
    expect_slot(story, first)
    expect_slot(story, second)


def test_a_restart_does_not_release_a_queue_a_command_halted(new_story):
    story = halted_story(new_story)
    story.home.restart_mark.write_text("1")
    first = queued(story, "make one")
    story.home.restart_mark.unlink()
    story.container.get(Bus).run(GrantRunSlots(), Actor.core())
    expect_waits(story, first)


def test_the_ticker_declares_the_handler_that_grants_spots(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    labels = [handler.label for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers]
    expect_value_with(labels, "run slots")


def test_the_main_agent_is_reminded_every_five_minutes_while_the_queue_is_halted_and_no_more_after_resuming(new_story):
    story = halted_story(new_story)
    expect_reminders_2(story, 1)
    expect_reminders(story, [])
    story.advance(timedelta(seconds=REMINDER_SECONDS + 1))
    expect_reminders_2(story, 1)
    story.expect_success("queue resume", actor=story.agent)
    story.advance(timedelta(seconds=REMINDER_SECONDS + 1))
    expect_reminders(story, [])


def test_a_restart_alone_sends_no_reminder(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.home.restart_mark.write_text("1")
    expect_reminders(story, [])


def expect_reminders(story, expected) -> None:
    actual = reminders(story)
    assert actual == expected, actual


def expect_reminders_2(story, expected) -> None:
    actual = len(reminders(story))
    assert actual == expected, actual


def expect_slot_3(story, first, second, third, expected) -> None:
    actual = (has_slot(story, first), has_slot(story, second), has_slot(story, third))
    assert actual == expected, actual
