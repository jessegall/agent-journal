import pytest

from datetime import timedelta

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.driver.block_until import BlockUntil
from core.base.driver.command_category import CommandCategory
from core.base.driver.conditions.ran_command import RanCommand
from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.chat.support.mark_samples import marks_text, expect_marks_text
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_reply import expect_reply_allowed
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_value_with

EDIT_HOOK = HookSamples.sample("pre_tool_use", {"name": "Write", "category": ToolType.NEW_FILE, "files": ["a.py"], "shell": None, "diff": None})
READ = HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": ["a.py"], "shell": None, "diff": None})
TITLE_LINE = "journal output title {process}"
TITLE_BLOCK = 2


def journal_line(line):
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand=line.split()[1]))
    return sample.with_fields(event="pre_tool_use", raw={"tool_input": {"command": line}})


def story_with_required_command(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "./deploy.sh staging", category=CommandCategory.BUILD)
    story.hook("s-1", HookSamples.sample("pre_tool_use", {"name": "Monitor", "category": "monitor", "input": {"command": f"journal output monitor {process.id}"}}).with_raw({"tool_input": {"command": f"journal output monitor {process.id}"}}))
    story.advance(timedelta(seconds=6))
    story.hook("s-1", HookSamples.stop())
    story.expect_text("agent-block list", TITLE_LINE.format(process=process.id), actor=story.agent)
    return story, process


def spend(story, count):
    hooks = []
    for _ in range(count):
        story.advance(timedelta(seconds=1))
        hooks.append(story.hook("s-1", EDIT_HOOK))
    return hooks


def test_a_line_that_names_its_command_opens_one_block_however_often_it_is_said(required_command):
    story, process = required_command
    story.hook("s-1", HookSamples.stop())
    story.expect_text(f"agent-block show {TITLE_BLOCK}", TITLE_LINE.format(process=process.id), actor=story.agent)
    story.expect_refusal(f"agent-block show {TITLE_BLOCK + 1}", f"no agent-block {TITLE_BLOCK + 1}", actor=story.agent)


def test_the_tool_uses_count_down_and_the_last_three_say_so(counted_required_command):
    story, _, hooks = counted_required_command
    countdown_lines = [[line for line in hook.lines if "due:" in line] for hook in hooks]
    expect_bool_countdown_lines(countdown_lines, [False, False, True, True, True])
    expect_countdown_lines_with_2(countdown_lines, "title output 1 due: 2 tool uses")
    expect_countdown_lines_with(countdown_lines, "title output 1 due: 0 tool uses")
    expect_absent_refusal_hook_hooks(hooks)


def test_past_the_fifth_a_write_is_refused_with_the_line_and_how_to_skip(counted_required_command):
    story, process, _ = counted_required_command
    refusal = story.hook("s-1", EDIT_HOOK).refusal
    expect_value_with(refusal, f"title output {process.id} is due")
    expect_value_with(refusal, f"skip block {TITLE_BLOCK} with a reason")


def test_running_the_command_settles_it_and_writes_run_again(required_command_limit):
    story, process = required_command_limit
    expect_reply_allowed(story.hook("s-1", journal_line(f'journal output title {process.id} "Deploy staging"')))
    expect_reply_allowed(story.hook("s-1", EDIT_HOOK))
    story.expect_text(f"agent-block show {TITLE_BLOCK}", "closed_at:", actor=story.agent)


def test_a_skip_needs_a_reason_settles_it_and_shows_in_the_chat(required_command_limit):
    story, _ = required_command_limit
    story.expect_usage_error(f"agent-block skip {TITLE_BLOCK}", actor=story.agent)
    story.expect_refusal(f'agent-block skip {TITLE_BLOCK} --reason "  "', "say why", actor=story.agent)
    story.expect_success(f'agent-block skip {TITLE_BLOCK} --reason "a one-off command"', actor=story.agent)
    expect_reply_allowed(story.hook("s-1", EDIT_HOOK))
    story.run_listeners()
    expect_marks_text(story, "a one-off command")


def test_a_line_that_names_no_command_opens_no_debt(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("agent-block list", "journal", actor=story.agent)


def test_a_block_that_waits_for_no_grace_cannot_be_skipped(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.container.get(Bus).run(BlockUntil(story.agent.id, Nudge("samples.wait", NudgeType.REFUSAL, "wait"), RanCommand("journal overview")), Actor.core())
    story.expect_refusal('agent-block skip 1 --reason "no grace"', "cannot be skipped", actor=story.agent)


def test_a_block_with_a_grace_span_holds_only_after_the_span_and_says_its_countdown(grace_countdown):
    story, refusal, countdown, first, second, third = grace_countdown
    expect_lines_with_2(first, "fee due: 1 tool uses")
    expect_lines_with_2(second, "fee due: 0 tool uses")
    expect_row(third, refusal="pay the 1 fee: journal agent-block skip 1 --reason '<why>'")


@pytest.fixture
def required_command(new_story):
    return story_with_required_command(new_story)


@pytest.fixture
def counted_required_command(required_command):
    story, process = required_command
    return story, process, spend(story, 5)


@pytest.fixture
def required_command_limit(counted_required_command):
    story, process, _ = counted_required_command
    spend(story, 1)
    return story, process


@pytest.fixture
def grace_countdown(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    refusal = Nudge("samples.pay", NudgeType.REFUSAL, "pay the {block} fee: journal agent-block skip {block} --reason '<why>'")
    countdown = Nudge("samples.pay_countdown", NudgeType.STEERING, "fee due: {left} tool uses")
    story.container.get(Bus).run(BlockUntil(story.agent.id, refusal, RanCommand("journal pay"), Interval(ToolUseSpan(2)), countdown), Actor.core())
    first, second, third = spend(story, 3)
    return story, refusal, countdown, first, second, third


def expect_lines_with_2(first, expected) -> None:
    actual = first.lines
    assert expected in actual, actual


def expect_absent_refusal_hook_hooks(hooks) -> None:
    actual = any((hook.refusal for hook in hooks))
    assert not actual, actual


def expect_countdown_lines_with(countdown_lines, expected) -> None:
    actual = countdown_lines[4][0]
    assert expected in actual, actual


def expect_countdown_lines_with_2(countdown_lines, expected) -> None:
    actual = countdown_lines[2][0]
    assert expected in actual, actual


def expect_bool_countdown_lines(countdown_lines, expected) -> None:
    actual = [bool(lines) for lines in countdown_lines]
    assert actual == expected, actual
