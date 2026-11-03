from core.base.timing import Timing
from core.modules.developer.support.developer_settings import HOOKS_SETTING, TOOLS_SETTING
from tests.stories.core.modules.drivers.support.developer_tools_enabled import DeveloperToolsEnabled
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser



def terminal_line(story) -> str:
    timing = story.container.get(Timing)
    timing.stamps[:] = Timing.started("go_start").stamps
    return story.hook("s-1", HookSamples.stop()).terminal


def test_no_hook_duration_reaches_the_terminal_while_the_developer_switch_is_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    assert terminal_line(story) == ""


def test_a_hook_duration_reaches_the_terminal_once_the_developer_switch_is_on(new_story):
    story = new_story(fixture=DeveloperToolsEnabled)
    line = terminal_line(story)
    assert line.startswith("hook stop ") and " ms" not in line and " points (" in line and " KB" in line, line


def test_switching_the_hooks_group_off_stops_the_durations_while_the_developer_switch_stays_on(new_story):
    story = new_story(fixture=DeveloperToolsEnabled)
    story.run(f"setting switch {HOOKS_SETTING} off --project", actor=story.user)
    assert terminal_line(story) == ""


def test_switching_the_developer_switch_off_turns_off_the_hooks_group_with_it(new_story):
    story = new_story(fixture=DeveloperToolsEnabled)
    story.run(f"setting switch {TOOLS_SETTING} off --project", actor=story.user)
    story.expect_success(f"setting show {HOOKS_SETTING}.terminal-durations", "value: off", actor=story.user)
    assert terminal_line(story) == ""


def test_a_stop_hook_costs_the_database_less_than_the_50_points_a_hook_may_cost(new_story):
    story = new_story(fixture=DeveloperToolsEnabled)
    line = terminal_line(story)
    points = int(line.split("hook stop ")[1].split(" points")[0])
    assert points < 50, line


def test_the_agent_is_never_told_what_a_hook_cost_and_the_terminal_says_when_it_went_over(new_story, monkeypatch):
    story = new_story(fixture=DeveloperToolsEnabled)
    timing = story.container.get(Timing)
    timing.stamps[:] = Timing.started("go_start").stamps
    assert not any("points" in line for line in story.hook("s-1", HookSamples.stop()).lines)
    monkeypatch.setattr("core.modules.drivers.support.hook_cost_tool.HOOK_LIMIT_POINTS", 1)
    timing.stamps[:] = Timing.started("go_start").stamps
    reply = story.hook("s-1", HookSamples.stop())
    assert not any("points" in line for line in reply.lines)
    assert "over the 1 a hook may cost" in reply.terminal


def test_each_line_sent_to_the_agent_shows_in_the_terminal_while_the_nudges_setting_is_on(new_story):
    story = new_story(fixture=BuilderWithUser)
    assert "to the agent:" not in story.hook("s-1", HookSamples.session_start()).terminal
    story.run(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    assert "journal: task:1 is yours now" in story.hook("s-1", HookSamples.stop()).terminal
