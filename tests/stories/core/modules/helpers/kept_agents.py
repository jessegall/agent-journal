from core.modules.helpers.support.agent_use import AgentUse
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.base.shell_sandbox import ShellSandbox
from core.testing.story_shell_sandbox import StoryShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.testing.story_helper_programs import StoryHelperPrograms
import pytest
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.usage.support.agent_type_limits import AgentTypeLimits
from core.modules.agents.support.type_limits import TypeLimits
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.testing.fake_launcher import FakeLauncher
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, resumable_session
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper as ReportedHelper
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.server.support.browser_story import expect_browser
import json

REASON = '--reason "Its question is answered"'


class EndedHelper(StoryFixture):
    """The helper of StartedHelper with its process stopped."""

    parent = StartedHelper

    def steps(self, story):
        helper = helper_agent(story)
        story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
        story.expect_success(f"agent stop {helper.id}", actor=story.agent)


@pytest.fixture
def helper_form_server(new_story, monkeypatch):
    story = new_story(fixture=ReportedHelper)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project", actor=story.user)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    monkeypatch.setattr(ShellSandbox, "check", StoryShellSandbox.check)
    monkeypatch.setattr(HelperPrograms, "checked", StoryHelperPrograms.checked)
    monkeypatch.setattr(HelperPrograms, "installed", StoryHelperPrograms.installed)
    launcher = FakeLauncher(story.home.socket("launcher"))
    try:
        with server_story(story, listener_thread_started=False) as server:
            yield server, helper
        story.run_listeners()
        launcher.wait_for_requests()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)


def profile_line(server, cookie, line):
    return server.viewer_line_value(cookie, {"window": "profiles.profiles", "environment": "main", "line": line})


def test_helper_form_offers_send_for_an_idle_helper_through_the_viewer(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    availability = profile_line(server, cookie, ["helper", "availability", "--profile", "journal-researcher"])
    server.story.expect_rows(not availability["can_start"] and availability["can_start_fresh"])
    server.story.expect_rows([row["id"] for row in availability["idle_helpers"]] == [helper.id])
    profile_line(server, cookie, ["helper", "send", str(helper.id), "Read src/tax.py"])
    jobs = tuple(server.story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).all_rows())
    server.story.expect_rows(jobs[-1].brief == "Read src/tax.py")
    server.story.expect_rows(len({job.helper_id for job in jobs}) == 1)


def test_helper_form_offers_send_and_records_the_reason_for_another_helper(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    profile_line(server, cookie, ["helper", "start", "journal-researcher", "--brief", "Read src/tax.py", "--fresh", "An independent comparison"])
    job = server.story.container.get(Queries).query(HelperJob).newest().first()
    server.story.expect_rows(job.helper_id != helper.id)
    server.story.expect_rows(job.new_agent_reason == "An independent comparison")


def test_helper_form_offers_send_at_the_kept_limit_and_preserves_the_command_refusal(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", "journal.core.helpers.helper-profile-limits", '["journal-researcher:4:1"]', "--project"]})
    availability = profile_line(server, cookie, ["helper", "availability", "--profile", "journal-researcher"])
    server.story.expect_rows([row["id"] for row in availability["idle_helpers"]] == [helper.id])
    server.story.expect_rows(not availability["can_start_fresh"])
    status, _, text = viewer_answer(server.viewer_port(), "/api/line", cookie, "", {"window": "profiles.profiles", "environment": "main", "line": ["helper", "start", "journal-researcher", "--brief", "Read the tax", "--fresh", "Another reader"]})
    answer = json.loads(text)
    server.story.expect_rows(status == 200 and answer["code"] != 0)
    server.story.expect_rows(json.loads(answer["error"])["refused"] in availability["fresh_reason"])
    profile_line(server, cookie, ["helper", "send", str(helper.id), "Read the tax"])


def test_helper_form_offers_send_in_light_and_dark(helper_form_server):
    server, helper = helper_form_server
    expect_browser(server, "helperStartForm.browser.mjs", [str(helper.id), "/tmp/worker-675-helper-form"])


def expect_start_refused(story, reason: str) -> None:
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_refusal('helper start journal-researcher --fresh "A second reader" --brief "Read src/till.py" --environment main', reason, actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_helper_stays_idle_when_its_process_stops(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_rows(helper.ended_at is not None, helper.retired_at is None, helper.session != "")


def test_retire_with_a_reason_keeps_its_record_and_it_is_not_retired_again(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent retire {helper.id} {REASON}", f"retired agent {helper.id}", actor=story.agent)
    retired = helper_agent(story)
    story.expect_rows(retired.retired_at is not None, retired.retirement_reason == "Its question is answered", retired.retiring_actor_id == story.agent.id)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "retired already", actor=story.agent)


def test_retire_needs_a_reason_and_an_ended_agent(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "still running", actor=story.agent)
    story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
    story.expect_success(f"agent stop {helper.id}", actor=story.agent)
    story.expect_refusal(f'agent retire {helper.id} --reason " "', "needs its reason", actor=story.agent)


def test_retire_permissions(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f"agent retire {story.agent.id} {REASON}", "main agent is not retired", actor=story.agent)
    story.expect_refusal(f"agent retire {helper.id} {REASON}", "answers to", actor=Actor(helper.id, ActorType.AGENT))
    story.expect_success(f"agent retire {helper.id} {REASON}", actor=story.user)


def test_retired_row_stays_retired(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f'agent edit {helper.id} --retirement-reason "Old"', "does not change a retirement", actor=story.user)
    story.expect_success(f"agent retire {helper.id} {REASON}", actor=story.agent)
    story.expect_refusal(f'agent edit {helper.id} --retirement-reason ""', "does not change a retirement", actor=story.user)
    story.expect_refusal(f"agent delete {helper.id}", "record stays", actor=story.user)
    story.expect_refusal(f'helper send {helper.id} "One more job"', "retired, for good", actor=story.agent)
    story.expect_rows(helper_agent(story).retired_at is not None)


def test_session_gone_says_retire(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f'helper send {helper.id} "One more job"', f"journal agent retire {helper.id}", actor=story.agent)


def test_session_gone_with_open_job_can_be_settled_and_retired(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent end {helper.id}", actor=story.user)
    story.run_listeners()
    story.expect_refusal(f'agent retire {helper.id} --reason "session gone"', f"journal helper stop {helper.id}", actor=story.user)
    story.expect_success(f"helper stop {helper.id}", actor=story.user)
    story.expect_success(f'agent retire {helper.id} --reason "session gone"', actor=story.user)
    story.expect_text(f"agent show {helper.id}", "retirement_reason: session gone", actor=story.user)


def test_old_callback_leaves_the_new_run(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent edit {helper.id} --pid 4242", actor=story.user)
    story.expect_success(f"agent exited {helper.id} 0 --pid 1111", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is None)
    story.expect_success(f"agent exited {helper.id} 0 --pid 4242", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is not None)


def test_a_person_sets_the_limits_of_a_profile_and_a_number_in_a_profile_file_is_not_read(new_story):
    story = new_story(fixture=StartedHelper)
    limits = story.container.get(AgentTypeLimits)
    story.expect_rows(limits.lookup("helper", "journal-researcher") == TypeLimits(4, 8), limits.lookup("main") is None)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:1:2"]\' --project', actor=story.user)
    story.expect_rows(story.container.get(AgentTypeLimits).lookup("helper", "journal-researcher") == TypeLimits(1, 2))
    story.expect_rows(story.container.get(AgentTypeLimits).lookup("helper", "journal-planner") == TypeLimits(4, 8))


def test_at_the_run_limit_a_start_of_that_profile_is_refused_and_another_profile_starts(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:1:8"]\' --project', actor=story.user)
    expect_start_refused(story, "1 of journal-researcher run")
    story.expect_rows(story.container.get(AgentTypeLimits).lookup("helper", "journal-debugger") == TypeLimits(4, 8))


def test_at_the_kept_maximum_a_new_start_is_refused_with_a_retire_line(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:4:1"]\' --project', actor=story.user)
    expect_start_refused(story, f"journal agent retire {helper.id}")


def test_launches_in_flight_count(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:1:8"]\' --project', actor=story.user)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success(f'helper send {helper.id} "One more job"', actor=story.agent)
    story.expect_refusal("helper start journal-researcher --fresh 'A second reader' --brief 'Read src/other.py' --environment main", "1 of journal-researcher run", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_start_with_an_idle_helper_is_refused_with_its_send_line(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_refusal('helper start journal-researcher --brief "Read src/till.py" --environment main', f'helper {helper.id} is idle: journal helper send {helper.id} "<job>"', actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_fresh_with_a_reason_starts_a_new_helper_and_keeps_the_reason(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success("helper start journal-researcher --fresh 'A second reader' --brief 'Read src/other.py' --environment main", actor=story.agent)
    job = story.container.get(Queries).query(HelperJob).newest().first()
    story.expect_rows(job.new_agent_reason == "A second reader")
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_an_idle_helper_on_another_model_or_with_its_session_gone_is_not_offered(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    kept = story.container.get(KeptHelpers)
    story.expect_rows(kept.idle("journal-researcher", "", "") == ())
    resumable_session(story, helper, monkeypatch)
    story.expect_rows(kept.idle("journal-researcher", "", "")[0].id == helper.id, kept.idle("journal-researcher", "", "another-model") == ())


def test_a_nearly_full_session_is_not_offered(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    kept = story.container.get(KeptHelpers)
    story.expect_rows(kept.idle("journal-researcher", "", "")[0].id == helper.id)
    monkeypatch.setattr(ClaudeCodeProvider, "context_percent", lambda provider, home, session: 80)
    story.expect_rows(kept.idle("journal-researcher", "", "") == ())


def test_two_sends_to_one_idle_helper_run_one_session(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success(f'helper send {helper.id} "One more job"', actor=story.agent)
    story.expect_success(f'helper send {helper.id} "And another"', actor=story.agent)
    open_jobs = story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).matching(IsNull("ended_at")).all_rows()
    story.expect_rows(len(tuple(open_jobs)) == 1)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_new_main_takes_over_an_idle_helper_and_gets_its_report(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper, monkeypatch)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_success(f'helper send {helper.id} "One more job"', actor=second)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).newest().first()
    story.expect_rows(helper_agent(story).parent_id == second.id, job.session_agent_id == second.id)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_steering_or_new_job(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f'helper send {helper.id} "Unrelated work"', f"helper {helper.id} is busy", actor=story.agent)
    story.expect_success(f'helper send {helper.id} "Also read the tax" --steer', actor=story.agent)
    jobs = tuple(story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).all_rows())
    story.expect_rows(len(jobs) == 1, "Also read the tax" in jobs[0].brief)


def test_same_reviewer_same_plan_is_refused(new_story, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    launcher = FakeLauncher(story.home.socket("launcher"), request_count=2)
    story.expect_success("helper start journal-plan-reviewer --plan 7 --brief 'Review plan 7' --environment main", actor=story.agent)
    reviewer = helper_agent(story)
    job = story.container.get(Queries).query(HelperJob).filter(helper_id=reviewer.id).first()
    story.expect_rows(job.review_plan_id == 7, job.new_agent_reason != "")
    story.expect_success(f"agent end {reviewer.id}", actor=story.user)
    story.run_listeners()
    resumable_session(story, reviewer, monkeypatch)
    story.expect_refusal(f'helper send {reviewer.id} "Review it again" --plan 7', "reviewed plan 7", actor=story.agent)
    story.expect_success(f'helper send {reviewer.id} "Review plan 8" --plan 8', actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_refusals_fit_and_a_kept_limit_with_all_running_says_wait(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success('setting set journal.core.helpers.helper-profile-limits \'["journal-researcher:4:1"]\' --project', actor=story.user)
    launcher = FakeLauncher(story.home.socket("launcher"))
    outcome = story.run("helper start journal-researcher --brief 'Read src/other.py' --environment main", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows("all of them run" in outcome.output_text, max(len(line) for line in outcome.output_text.splitlines()) <= 120)


def test_a_refusal_for_no_kept_place_suggests_the_idle_agent_of_the_model_with_the_most_to_spare(new_story):
    story = new_story(fixture=ReportedHelper)
    helper = helper_agent(story)
    story.expect_text("agent mix", f"journal-researcher, {helper.program_model}: jobs 1, kept 1, idle", actor=story.agent)
    story.expect_rows(f"journal agent retire {helper.id}" in story.container.get(AgentUse).retire_suggestion("journal-researcher"),
                      story.container.get(AgentUse).retire_suggestion("journal-planner") == "")
