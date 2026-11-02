from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.usage.support.status_files import SEVEN_DAYS_RESET, full_status, save_status_file
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


def test_a_window_the_program_left_out_of_its_report_says_it_is_not_reported(new_story):
    story = new_story(fixture=UserJoined)
    save_status_file(story, "s-1", {"rate_limits": {"seven_day": {"used_percentage": 17, "resets_at": SEVEN_DAYS_RESET}}})
    story.expect_text("usage show --environment main", "plan: 7 days 17% used, starts again 2026-11-05 11:00 UTC; 5 hours not reported", actor=story.user)


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


def test_the_usage_window_reads_the_usage(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("usage.usage", "usage show")


def test_the_bars_count_helpers_tasks_and_questions_and_name_the_main_agents_task(new_story):
    story = new_story(fixture=UserJoined)
    story.run(HELPER_START.format(parent=story.agent.id))
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_text("usage bars --environment main", "1 helpers, 2 tasks, 0 waiting", actor=story.user)
    story.expect_text("usage bars --environment main --json", '"task_id": 1', '"task_title": "Fix the cart"', actor=story.user)


def test_the_tool_is_the_one_the_main_agent_began_until_it_stops(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"])))
    story.expect_text("usage tool --environment main", "Bash ls build", actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("usage tool --environment main", "Bash", actor=story.user)


def test_a_session_says_when_it_was_last_compacted(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("usage show --environment main --json", '"last_compacted_at": null', actor=story.user)
    story.hook("s-1", HookSamples.sample("compact"))
    story.expect_text("usage show --environment main --json", '"last_compacted_at": "2026', actor=story.user)
