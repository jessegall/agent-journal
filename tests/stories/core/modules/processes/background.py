from datetime import timedelta

from core.base.command.bus import Bus
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

NOTHING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
AFTER = NOTHING.with_fields(event="post_tool_use")
TESTS_REPORT = "collected 3 items\nFAILED tests/test_cart.py::test_total - assert 1 == 2\n2 failed, 1 passed in 0.4s\n"
ENDED = "output 1 ended: 2 failed 1 passed; journal output read 1 --summary"
UNREAD = "output 1 unread: journal output read 1 --summary"


def lines_of(story, sample) -> list[str]:
    return list(story.hook("s-1", sample).lines)


def test_the_end_of_a_background_run_tells_the_agent_once_with_the_readers_summary(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    assert ENDED in lines_of(story, NOTHING)
    assert ENDED not in lines_of(story, NOTHING)


def ended_lines(new_story, line, text=TESTS_REPORT, category=None):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, line, category=category)
    end_run(story, process, text)
    story.advance(timedelta(seconds=1))
    return story, process, lines_of(story, NOTHING)


def test_a_run_no_reader_reads_tells_the_agent_to_draft_one_once(new_story):
    story, _, plain = ended_lines(new_story, "grep -n word file", "one\ntwo\n")
    assert not any("no reader reads" in line for line in plain)
    story, _, lines = ended_lines(new_story, "./deploy.sh staging", "uploading\nall done\n", category=CommandCategory.BUILD)
    assert any("no reader reads deploy.sh yet" in line and 'journal reader add deploy.sh --commands "./deploy.sh*"' in line for line in lines)
    assert not any("no reader reads" in line for line in lines_of(story, NOTHING))


def test_a_shell_loop_is_not_told_to_draft_a_reader_for_its_keyword(new_story):
    _, _, lines = ended_lines(new_story, "for i in 1 2 3; do ./deploy.sh; done", "uploading\n")
    assert not any("no reader reads" in line for line in lines)


def test_a_run_a_reader_reads_gets_no_advice(new_story):
    _, _, lines = ended_lines(new_story, "pytest -q")
    assert ENDED in lines
    assert not any("no reader reads" in line for line in lines)


def test_a_run_that_printed_nothing_gets_no_advice(new_story):
    _, _, lines = ended_lines(new_story, "./deploy.sh staging", "")
    assert not any("no reader reads" in line for line in lines)


def test_a_run_that_ended_in_the_foreground_is_not_told(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    ended_run(story, "pytest -q", TESTS_REPORT, exit_code=1)
    assert not any("ended" in line for line in lines_of(story, NOTHING))


def test_the_reminder_comes_after_5_tool_uses_and_once_in_a_turn_while_the_output_is_not_read(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", NOTHING)
    reminders = [UNREAD in lines_of(story, AFTER) for _ in range(10)]
    assert reminders == [False, False, False, False, True, False, False, False, False, False]


def test_outputs_that_ended_apart_are_named_together_once_in_a_turn(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    first = moved_run(story, "pytest -q")
    end_run(story, first, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    lines_of(story, AFTER)
    lines_of(story, AFTER)
    second = moved_run(story, "pytest -q tests/cart")
    end_run(story, second, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", NOTHING)
    labelled = [line for _ in range(10) for line in lines_of(story, AFTER) if "unread" in line]
    assert labelled == [f"output {first.id}, {second.id} unread: journal output read {first.id} --summary"]


def test_reading_the_output_ends_the_reminders(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(seconds=1))
    story.hook("s-1", NOTHING)
    story.run(f"output read {process.id} --summary", actor=story.agent)
    assert [UNREAD in lines_of(story, AFTER) for _ in range(10)] == [False] * 10


def test_an_output_left_unread_for_half_an_hour_is_no_longer_named(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest -q")
    end_run(story, process, TESTS_REPORT, exit_code=1)
    story.advance(timedelta(minutes=31))
    story.hook("s-1", NOTHING)
    assert [UNREAD in lines_of(story, AFTER) for _ in range(10)] == [False] * 10


def test_a_reader_that_picks_no_line_is_told_to_fix_its_pattern(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "NOTHING MATCHES THIS"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging")
    end_run(story, process, "uploading\nall done\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    assert any("reader deploys picked no line" in line for line in lines_of(story, NOTHING))


def test_a_reader_that_keeps_nearly_every_line_is_told_to_narrow_and_one_with_no_summary_to_add_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "step" --summary "NOTHING MATCHES THIS"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging")
    end_run(story, process, "".join(f"step {number}\n" for number in range(60)))
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    lines = lines_of(story, NOTHING)
    assert any("reader deploys kept 60 of the 60 lines" in line for line in lines)
    assert any("reader deploys found no summary" in line for line in lines)


def test_a_run_printing_a_count_with_no_progress_pattern_is_told_to_add_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add deploys --commands "./deploy*" --lines "step"', actor=story.agent)
    process = moved_run(story, "./deploy.sh staging")
    end_run(story, process, "step 3/9\nstep 9/9\n")
    story.container.get(Bus).run(ReadNewOutput(process.id, True), story.agent, environment_id=1)
    story.advance(timedelta(seconds=1))
    assert any("prints a count its card draws no bar for" in line for line in lines_of(story, NOTHING))


def test_a_run_that_prints_nothing_for_30_seconds_is_told_it_may_buffer(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "./deploy.sh staging")
    assert not any("may buffer" in line for line in lines_of(story, NOTHING))
    story.advance(timedelta(seconds=31))
    assert any(f"output {process.id} has printed nothing for 30 seconds" in line for line in lines_of(story, NOTHING))
