from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, StartedHelper, helper_agent
from tests.stories.core.modules.usage.support.status_files import save_status_file
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

CARDS = "usage agents --environment main --json"
WINDOW = "usage show --environment main --json"


def save_helper_status(story, spent_usd: float) -> None:
    report = {"context_window": {"used_percentage": 20}, "cost": {"total_cost_usd": spent_usd}}
    save_status_file(story, helper_agent(story).session, report)


def test_a_helper_with_no_report_shows_no_figure_rather_than_zero(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_text(CARDS, '"cost_dollars": null', actor=story.user)
    story.expect_no_text(CARDS, '"cost_dollars": 0', actor=story.user)
    story.expect_text("usage show --environment main", "nothing reported yet", actor=story.user)


def test_the_cost_window_sums_a_helper_with_its_profile(new_story):
    story = new_story(fixture=StartedHelper)
    save_helper_status(story, 1.5)
    story.expect_text(WINDOW, '"role": "helper"', f'"profile": "{RESEARCHER_PROFILE.name}"', '"cost_dollars": 1.5', actor=story.user)
    story.expect_text("usage show --environment main", "cost of the open sessions: $1.50", actor=story.user)


def test_the_cost_window_keeps_a_helper_that_ended_while_its_parent_runs(new_story):
    story = new_story(fixture=EndedHelper)
    save_helper_status(story, 1.5)
    story.expect_text("usage show --environment main", "cost of the open sessions: $1.50", actor=story.user)


def test_the_open_sessions_alone_leave_out_an_ended_helper_for_the_shell(new_story):
    story = new_story(fixture=EndedHelper)
    save_helper_status(story, 1.5)
    story.expect_no_text("usage show --open --environment main --json", f'"id": {helper_agent(story).id},', actor=story.user)
    story.expect_text("usage show --open --environment main --json", f'"id": {story.agent.id},', actor=story.user)


def test_the_cost_window_drops_an_ended_helper_once_its_parent_ended(new_story):
    story = new_story(fixture=EndedHelper)
    save_helper_status(story, 1.5)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    story.expect_no_text("usage show --environment main", "$1.50", actor=story.user)


def test_a_helpers_card_shows_why_it_ended(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent exited {helper_agent(story).id} 137")
    story.expect_text(f"{CARDS.replace('--json', '--closed --json')}", "its program exited with code 137", actor=story.user)
