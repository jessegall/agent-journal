from tests.stories.core.modules.usage.support.status_files import full_status, save_status_file
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined

HELPER_START = "agent start s-2 claude worker --parent {parent} --environment main"


def test_each_open_agent_shows_its_model_context_and_cost_from_its_status_line(new_story):
    story = new_story(fixture=UserJoined)
    full_status(story, "s-1", 42, 1.234)
    story.expect_text("usage show --environment main", f"agent {story.agent.id}  s-1  claude  Opus  context 42%  cost $1.23", actor=story.user)


def test_the_plan_windows_show_how_much_is_used_and_when_each_starts_again(new_story):
    story = new_story(fixture=UserJoined)
    full_status(story, "s-1", 42, 1.234)
    story.expect_text("usage show --environment main", "plan: 5 hours 30% used, starts again 2026-11-01 15:00 UTC; 7 days 65% used, starts again 2026-11-05 11:00 UTC",
                      actor=story.user)


def test_an_agent_that_reported_nothing_says_so_the_plan_comes_from_the_newest_report_and_the_cost_adds_up(new_story):
    story = new_story(fixture=UserJoined)
    full_status(story, "s-1", 42, 1.234)
    helper = story.new_row_id(HELPER_START.format(parent=story.agent.id))
    story.expect_text("usage show --environment main", f"agent {helper}  s-2  claude  nothing reported yet", "plan: 5 hours 30% used",
                      "cost of the open sessions: $1.23", actor=story.user)
    save_status_file(story, "s-2", {"cost": {"total_cost_usd": 0.5}})
    story.expect_text("usage show --environment main", "cost of the open sessions: $1.73", actor=story.user)


def test_with_no_report_at_all_the_plan_says_nothing_is_reported_yet(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("usage show --environment main", f"agent {story.agent.id}  s-1  claude  nothing reported yet", "plan: no limits reported yet",
                      actor=story.user)


def test_an_ended_agent_is_left_out(new_story):
    story = new_story(fixture=UserJoined)
    helper = story.new_row_id(HELPER_START.format(parent=story.agent.id))
    story.expect_success(f"agent end {helper}", actor=story.user)
    story.expect_absent("usage show --environment main", f"agent {helper}  s-2  claude  nothing reported yet", actor=story.user)


def test_usage_outside_an_environment_is_refused_with_how_to_name_one(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("usage show", "usage is shown for one environment: name it with --environment", actor=story.user)


def test_the_usage_window_reads_the_usage_and_the_counts(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("usage.usage", "usage show")
    window.expect_window_allowed("usage.usage", "statistic list")
