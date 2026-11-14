import json
from datetime import timedelta

from engine.file.file_access import FileAccess
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker
from engine.testing.stories.story import Story
from tests.stories.core.support.coding_fixtures import UserBuilder

WINDOW_SECONDS = 5 * 3600
WEEK_SECONDS = 7 * 24 * 3600


def report(story: Story, five_hours: float, seven_days: float = 0) -> None:
    """What the program's status line says of the plan: both windows, each starting again later."""
    now = story.clock.timestamp().value.timestamp()
    limits = {"five_hour": {"used_percentage": five_hours, "resets_at": now + WINDOW_SECONDS}, "seven_day": {"used_percentage": seven_days, "resets_at": now + WEEK_SECONDS}}
    story.home.status_folder.mkdir(parents=True, exist_ok=True)
    FileAccess.write(story.home.status_folder / "s-1.json", json.dumps({"session_id": "s-1", "model": {"display_name": "Opus"}, "context_window": {"used_percentage": 10}, "rate_limits": limits}))


def limited_story(new_story) -> Story:
    story = new_story(fixture=UserBuilder)
    story.bind(ProgramStates, story.container.constructed(ProgramStates))
    return story


def halted(story: Story) -> bool:
    UsageLimitMarker()(story.container)
    return story.row(Agent, story.agent.id).usage_limit_ends_at is not None


def test_an_hourly_budget_counts_from_the_start_of_the_clock_hour_and_starts_again_with_the_next(new_story):
    story = limited_story(new_story)
    report(story, 30)
    story.expect_success("usage-limit set claude hour budget 20", actor=story.user)
    report(story, 55)
    story.expect_rows(halted(story))
    story.advance(timedelta(hours=1))
    report(story, 55)
    story.expect_rows(not halted(story))
    report(story, 80)
    story.expect_rows(halted(story))


def test_a_removed_limit_lets_the_agents_go_on(new_story):
    story = limited_story(new_story)
    story.expect_success("usage-limit set claude '5 hours' fixed 50", actor=story.user)
    report(story, 55)
    story.expect_rows(halted(story))
    story.expect_success("usage-limit delete 1", actor=story.user)
    story.expect_rows(not halted(story))


def test_a_program_with_a_limit_reached_takes_no_new_agent_and_an_agent_cannot_set_a_limit(new_story):
    story = limited_story(new_story)
    story.expect_refusal("usage-limit set claude '5 hours' fixed 50", "an agent cannot", actor=story.agent)
    story.expect_success("usage-limit set claude '5 hours' fixed 50", actor=story.user)
    report(story, 55)
    story.expect_rows(not story.container.get(ProgramStates).allowance_state("claude").is_ready)
