from core.base.timing import Timing
from core.testing.hook_samples import HookSamples
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted

MASTER = "journal.core.developer.tools"
HOOKS = "journal.core.developer.tools.hooks"


class BuilderWithUser(StoryFixture):
    """A person, Ada, beside the started builder: story.user."""

    parent = BuilderStarted

    def steps(self, story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)

    def expect(self, story) -> None:
        story.expect_success(f"actor show {story.user.id}", "type: user", "name: Ada")


def terminal_line(story) -> str:
    timing = story.container.get(Timing)
    timing.stamps[:] = Timing.started("go_start").stamps
    return story.hook("s-1", HookSamples.stop()).terminal


def test_no_hook_duration_reaches_the_terminal_while_the_developer_switch_is_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    assert terminal_line(story) == ""


def test_a_hook_duration_reaches_the_terminal_once_the_developer_switch_is_on(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    line = terminal_line(story)
    assert line.startswith("hook stop ") and " ms, " in line and " points (" in line and " KB" in line, line


def test_switching_the_hooks_group_off_stops_the_durations_while_the_developer_switch_stays_on(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    story.run(f"setting switch {HOOKS} off --project", actor=story.user)
    assert terminal_line(story) == ""


def test_switching_the_developer_switch_off_turns_off_the_hooks_group_with_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    story.run(f"setting switch {MASTER} off --project", actor=story.user)
    story.expect_success(f"setting show {HOOKS}.terminal-durations", "value: off", actor=story.user)
    assert terminal_line(story) == ""


def test_a_stop_hook_costs_the_database_less_than_the_50_points_a_hook_may_cost(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    line = terminal_line(story)
    points = int(line.split(" ms, ")[1].split(" points")[0])
    assert points < 50, line


def test_the_agent_is_told_of_a_hook_only_when_it_costs_the_points_over_the_limit(new_story, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    timing = story.container.get(Timing)
    timing.stamps[:] = Timing.started("go_start").stamps
    assert not any("points" in line for line in story.hook("s-1", HookSamples.stop()).lines)
    monkeypatch.setattr("core.modules.drivers.support.hook_durations.HOOK_POINT_LIMIT", 1)
    timing.stamps[:] = Timing.started("go_start").stamps
    assert any("cost" in line and "points" in line for line in story.hook("s-1", HookSamples.stop()).lines)


def test_each_line_sent_to_the_agent_shows_in_the_terminal_while_the_nudges_setting_is_on(new_story):
    story = new_story(fixture=BuilderWithUser)
    assert "to the agent:" not in story.hook("s-1", HookSamples.session_start()).terminal
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    assert "task 1 is yours now" in story.hook("s-1", HookSamples.stop()).terminal
