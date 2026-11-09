from core.modules.helpers.support.helper_settings import HELPER_MAX_COST
from core.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.helper_jobs import JOB, EndedHelper, StartedHelper, helper_agent, read_jobs, resumable_session
from tests.stories.core.modules.helpers.helper_reports import enforced, helper_report
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.support.story_checks import expect_value


def report_cost(story, dollars: float) -> None:
    save_status_file(story, helper_agent(story).session, {"cost": {"total_cost_usd": dollars}})


def test_s59_fractional_cap_is_enforced(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"setting set {HELPER_MAX_COST} 0.5 --project", actor=story.user)
    report_cost(story, 0.6)
    enforced(story, 1)
    story.expect_text(f"message read {helper_report(story).id}", "stopped at its cost limit")


def test_s59_kept_session_new_job_has_new_cost_baseline(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    report_cost(story, 3)
    story.expect_success(f"setting set {HELPER_MAX_COST} 1 --project", actor=story.user)
    launcher = FakeLauncher(story.home.socket("launcher")).serve()
    resumable_session(story, helper, monkeypatch)
    story.expect_success(f'helper send {helper.id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    expect_value([job.cost_baseline for job in read_jobs(story, helper)], [0.0, 3.0])
    report_cost(story, 3.4)
    enforced(story, 1)
    story.expect_rows(helper_agent(story).ended_at is None)


def test_s59_resume_keeps_budget_use(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"setting set {HELPER_MAX_COST} 1 --project", actor=story.user)
    report_cost(story, 0.6)
    story.expect_success(f'helper send {helper.id} "{JOB}" --steer', actor=story.agent)
    expect_value([job.cost_baseline for job in read_jobs(story, helper)], [0.0])
    report_cost(story, 1.2)
    enforced(story, 1)
    story.expect_text(f"message read {helper_report(story).id}", "stopped at its cost limit")
