from core.modules.helpers.support.helper_settings import HELPER_MAX_COST
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.helper_jobs import JOB, EndedHelper, StartedHelper, helper_agent, read_jobs, resumable_session
from tests.stories.core.modules.helpers.helper_reports import enforced, helper_report
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.support.story_checks import expect_value


def report_cost(story, dollars: float) -> None:
    save_status_file(story, helper_agent(story).session, {"cost": {"total_cost_usd": dollars}})




def test_s59_kept_session_new_job_has_new_cost_baseline(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    report_cost(story, 3)
    story.expect_success(f"setting set {HELPER_MAX_COST} 1 --project", actor=story.user)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    resumable_session(story, helper)
    story.expect_success(f'helper send {helper.id} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    expect_value([job.cost_baseline for job in read_jobs(story, helper)], [0.0, 3.0])
    report_cost(story, 3.4)
    enforced(story, 1)
    story.expect_rows(helper_agent(story).ended_at is None)


