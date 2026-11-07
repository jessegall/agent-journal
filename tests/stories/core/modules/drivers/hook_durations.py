from core.testing.story_fixture import StoryFixture

from core.base.timing import Timing
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from core.testing.expect_reply import expect_absent_reply_line
from tests.stories.support.story_checks import expect_startswith_listed, expect_value_with, expect_value_without

MASTER = "journal.core.developer.tools"
HOOKS = "journal.core.developer.tools.hooks"


def terminal_line(story) -> str:
    timing = story.container.get(Timing)
    timing.stamps[:] = Timing.started("go_start").stamps
    return story.hook("s-1", HookSamples.stop()).terminal


def test_no_hook_duration_reaches_the_terminal_while_the_developer_switch_is_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    expect_terminal_line(story, "")


def test_a_hook_duration_reaches_the_terminal_once_the_developer_switch_is_on(new_story):
    story = new_story(fixture=HookLogging)
    line = terminal_line(story)
    expect_startswith_listed(line, "hook stop ")
    expect_value_without(line, " ms")
    expect_value_with(line, " points (")
    expect_value_with(line, " KB")


def test_switching_the_hooks_group_off_stops_the_durations_while_the_developer_switch_stays_on(new_story):
    story = new_story(fixture=HookLogging)
    story.run(f"setting switch {HOOKS} off --project", actor=story.user)
    expect_terminal_line(story, "")


def test_switching_the_developer_switch_off_turns_off_the_hooks_group_with_it(new_story):
    story = new_story(fixture=HookLogging)
    story.run(f"setting switch {MASTER} off --project", actor=story.user)
    story.expect_success(f"setting show {HOOKS}.terminal-durations", "value: off", actor=story.user)
    expect_terminal_line(story, "")


def test_a_stop_hook_costs_the_database_less_than_the_50_points_a_hook_may_cost(new_story):
    story = new_story(fixture=HookLogging)
    line = terminal_line(story)
    points = int(line.split("hook stop ")[1].split(" points")[0])
    expect_value_less(points, 50)


def test_the_agent_is_never_told_what_a_hook_cost_and_the_terminal_says_when_it_went_over(new_story, monkeypatch):
    story = new_story(fixture=HookLogging)
    timing = story.container.get(Timing)
    timing.stamps[:] = Timing.started("go_start").stamps
    story.expect_absent_hook_line("s-1", HookSamples.stop(), "points")
    monkeypatch.setattr("core.modules.drivers.support.hook_cost_tool.HOOK_LIMIT_POINTS", 1)
    timing.stamps[:] = Timing.started("go_start").stamps
    reply = story.hook("s-1", HookSamples.stop())
    expect_absent_reply_line(reply, "points")
    expect_terminal_reply_with(reply, "over the 1 a hook may cost")


def test_each_line_sent_to_the_agent_shows_in_the_terminal_while_the_nudges_setting_is_on(new_story):
    story = new_story(fixture=BuilderWithUser)
    expect_terminal_hook_without(story, "s-1", "to the agent:")
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    expect_terminal_hook_with(story, "s-1", "journal: task:1 is yours now")


class HookLogging(StoryFixture):
    parent = BuilderWithUser

    def steps(self, story):
        story.run(f'setting switch {MASTER} on --project', actor=story.user)


def expect_terminal_line(story, expected) -> None:
    actual = terminal_line(story)
    assert actual == expected, actual


def expect_terminal_hook_with(story, text, expected) -> None:
    actual = story.hook(text, HookSamples.stop()).terminal
    assert expected in actual, actual


def expect_terminal_hook_without(story, text, expected) -> None:
    actual = story.hook(text, HookSamples.session_start()).terminal
    assert expected not in actual, actual


def expect_terminal_reply_with(reply, expected) -> None:
    actual = reply.terminal
    assert expected in actual, actual


def expect_value_less(actual, expected) -> None:
    assert actual < expected, actual
