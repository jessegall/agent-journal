from core.modules.helpers.ticks.unused_helper_retirements import UnusedHelperRetirements
from datetime import timedelta
from engine.enums.occupant import Occupant
from tests.stories.core.support.agent_labels import agent_number
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.testing.stories.story_shell_sandbox import StoryShellSandbox
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.testing.story_helper_programs import StoryHelperPrograms
import pytest
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.usage.support.agent_type_limits import AgentTypeLimits
from core.modules.agents.support.type_limits import TypeLimits
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent, resumable_session
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper as ReportedHelper
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.browser_story import expect_browser
from engine.provider.context_window import ContextWindow
from core.modules.helpers.support.profile_model import ProfileModel
from tests.stories.core.support.agent_labels import agent_label
from core.modules.helpers.support.helper_settings import HELPER_IDLE_HOURS, HELPER_PROFILE_LIMITS
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED
from suites.coding.support.shipped_profiles import DEBUGGER_PROFILE
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

TEST_ROWS_REASON = "the test reads every row it checks"

REASON = '--reason "Its question is answered"'


class EndedHelper(StoryFixture):
    """The helper of StartedHelper with its process stopped."""

    parent = StartedHelper

    def steps(self, story):
        helper = helper_agent(story)
        story.expect_success(f"agent edit {agent_number(story, helper.id)} --pid 4242", actor=story.user)
        story.expect_success(f"agent stop {agent_number(story, helper.id)}", actor=story.agent)


@pytest.fixture
def helper_form_server(played):
    story = played(ReportedHelper)
    story.expect_success(f"setting set {TOUR_COMPLETED} true --project", actor=story.user)
    helper = helper_agent(story)
    resumable_session(story, helper)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    try:
        with server_story(story, listener_thread_started=False) as server:
            yield server, helper
        story.run_listeners()
        launcher.drain_requests()
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)


def profile_line(server, cookie, line):
    return server.viewer_line_value(cookie, {"window": "profiles.profiles", "environment": "main", "line": line})


def test_helper_form_offers_send_for_an_idle_helper_through_the_viewer(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    availability = profile_line(server, cookie, ["helper", "availability", "--profile", f"{RESEARCHER_PROFILE.name}"])
    server.story.expect_rows(not availability["can_start"] and availability["can_start_fresh"])
    server.story.expect_rows([row["id"] for row in availability["idle_helpers"]] == [helper.id])
    profile_line(server, cookie, ["helper", "send", str(agent_number(server.story, helper.id)), "Read src/tax.py"])
    jobs = tuple(server.story.story_rows(HelperJob, helper_id=helper.id))
    server.story.expect_rows(jobs[-1].brief == "Read src/tax.py")
    server.story.expect_rows(len({job.helper_id for job in jobs}) == 1)


def test_helper_form_offers_send_and_records_the_reason_for_another_helper(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    profile_line(server, cookie, ["helper", "start", f"{RESEARCHER_PROFILE.name}", "--brief", "Read src/tax.py", "--fresh", "An independent comparison"])
    job = server.story.newest_row(HelperJob)
    server.story.expect_rows(job.helper_id != helper.id)
    server.story.expect_rows(job.new_agent_reason == "An independent comparison")


def test_helper_form_offers_send_for_the_idle_helper_and_a_fresh_start_beside_it_whatever_the_profile_keeps(helper_form_server):
    server, helper = helper_form_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", f"{HELPER_PROFILE_LIMITS}", f'["{RESEARCHER_PROFILE.name}:4"]', "--project"]})
    availability = profile_line(server, cookie, ["helper", "availability", "--profile", f"{RESEARCHER_PROFILE.name}"])
    server.story.expect_rows([row["id"] for row in availability["idle_helpers"]] == [helper.id], availability["can_start_fresh"])


def test_helper_form_offers_send_in_light_and_dark(helper_form_server):
    server, helper = helper_form_server
    expect_browser(server, "helperStartForm.browser.mjs", [str(helper.id), "/tmp/worker-675-helper-form"])


def expect_start_refused(story, reason: str) -> None:
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_refusal(f'helper start {RESEARCHER_PROFILE.name} --fresh "A second reader" --brief "Read src/till.py" --environment main', reason, actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_helper_stays_idle_when_its_process_stops(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    story.expect_rows(helper.ended_at is not None, helper.retired_at is None, helper.session != "")


def test_retire_with_a_reason_keeps_its_record_and_it_is_not_retired_again(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent retire {agent_number(story, helper.id)} {REASON}", f"retired {agent_label(story, helper.id)}", actor=story.user)
    retired = helper_agent(story)
    story.expect_rows(retired.retired_at is not None, retired.retirement_reason == "Its question is answered", retired.retiring_actor_id == story.user.id)
    story.expect_refusal(f"agent retire {agent_number(story, helper.id)} {REASON}", "retired already", actor=story.agent)


def test_retire_needs_a_reason_and_an_ended_agent(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f"agent retire {agent_number(story, helper.id)} {REASON}", "still running", actor=story.agent)
    story.expect_success(f"agent edit {agent_number(story, helper.id)} --pid 4242", actor=story.user)
    story.expect_success(f"agent stop {agent_number(story, helper.id)}", actor=story.agent)
    story.expect_refusal(f'agent retire {agent_number(story, helper.id)} --reason " "', "needs its reason", actor=story.agent)


def test_retire_permissions(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f"agent retire {agent_number(story, story.agent.id)} {REASON}", "main agent is not retired", actor=story.agent)
    story.expect_refusal(f"agent retire {agent_number(story, helper.id)} {REASON}", "only a user or the main agent retires", actor=Actor(helper.id, ActorType.AGENT))
    story.expect_success(f"agent retire {agent_number(story, helper.id)} {REASON}", actor=story.user)


def test_retired_row_stays_retired(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f'agent edit {agent_number(story, helper.id)} --retirement-reason "Old"', "does not change a retirement", actor=story.user)
    story.expect_success(f"agent retire {agent_number(story, helper.id)} {REASON}", actor=story.user)
    story.expect_refusal(f'agent edit {agent_number(story, helper.id)} --retirement-reason ""', "does not change a retirement", actor=story.user)
    story.expect_refusal(f"agent delete {agent_number(story, helper.id)}", "record stays", actor=story.user)
    story.expect_refusal(f'helper send {agent_number(story, helper.id)} "One more job"', "retired, for good", actor=story.agent)
    story.expect_rows(helper_agent(story).retired_at is not None)


def test_session_gone_with_open_job_can_be_settled_and_retired(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent pause {agent_number(story, story.agent.id)}", actor=story.user)
    story.expect_success(f"agent end {helper.id}", actor=story.user)
    story.run_listeners()
    story.expect_refusal(f'agent retire {agent_number(story, helper.id)} --reason "session gone"', f"journal helper stop {agent_number(story, helper.id)}", actor=story.user)
    story.expect_success(f"helper stop {agent_number(story, helper.id)}", actor=story.user)
    story.expect_success(f'agent retire {agent_number(story, helper.id)} --reason "session gone"', actor=story.user)
    story.expect_text(f"agent show {agent_number(story, helper.id)}", "retirement_reason: session gone", actor=story.user)


def test_old_callback_leaves_the_new_run(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"agent edit {agent_number(story, helper.id)} --pid 4242", actor=story.user)
    story.expect_success(f"agent exited {helper.id} 0 --pid 1111", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is None)
    story.expect_success(f"agent exited {helper.id} 0 --pid 4242", actor=story.user)
    story.expect_rows(helper_agent(story).ended_at is not None)


def test_a_person_sets_the_limits_of_a_profile_and_a_number_in_a_profile_file_is_not_read(played):
    story = played(StartedHelper)
    limits = story.container.get(AgentTypeLimits)
    story.expect_rows(limits.lookup("helper", f"{RESEARCHER_PROFILE.name}") == TypeLimits(4, 0), limits.lookup("main") is None)
    story.expect_success(f'setting set {HELPER_PROFILE_LIMITS} \'["{RESEARCHER_PROFILE.name}:1"]\' --project', actor=story.user)
    story.expect_rows(story.container.get(AgentTypeLimits).lookup("helper", f"{RESEARCHER_PROFILE.name}") == TypeLimits(1, 0))
    story.expect_rows(story.container.get(AgentTypeLimits).lookup("helper", f"{PLANNER_PROFILE.name}") == TypeLimits(4, 0))


def test_at_the_run_limit_a_start_of_that_profile_is_refused_and_another_profile_starts(played):
    story = played(StartedHelper)
    story.expect_success(f'setting set {HELPER_PROFILE_LIMITS} \'["{RESEARCHER_PROFILE.name}:1"]\' --project', actor=story.user)
    expect_start_refused(story, f"1 of {RESEARCHER_PROFILE.name} run")
    story.expect_rows(story.container.get(AgentTypeLimits).lookup("helper", f"{DEBUGGER_PROFILE.name}") == TypeLimits(4, 0))


def test_a_helper_idle_past_its_hours_is_retired_for_going_unused_and_a_recently_used_one_is_kept(played):
    story = played(ReportedHelper)
    helper = helper_agent(story)
    story.advance(timedelta(hours=23))
    UnusedHelperRetirements()(story.container)
    story.expect_rows(helper_agent(story).retired_at is None)
    story.advance(timedelta(hours=2))
    UnusedHelperRetirements()(story.container)
    retired = story.row(Agent, helper.id)
    story.expect_rows(retired.retired_at is not None, retired.retirement_reason == "it took no job for 24 hours")


def test_a_running_helper_on_its_job_is_never_retired_for_going_unused(played):
    story = played(StartedHelper)
    story.advance(timedelta(days=3))
    UnusedHelperRetirements()(story.container)
    story.expect_rows(helper_agent(story).retired_at is None)


def test_at_0_idle_hours_no_helper_is_retired(played):
    story = played(ReportedHelper)
    story.expect_success(f"setting set {HELPER_IDLE_HOURS} 0 --project", actor=story.user)
    story.advance(timedelta(days=30))
    UnusedHelperRetirements()(story.container)
    story.expect_rows(helper_agent(story).retired_at is None)


def test_launches_in_flight_count(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    story.expect_success(f'setting set {HELPER_PROFILE_LIMITS} \'["{RESEARCHER_PROFILE.name}:1"]\' --project', actor=story.user)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(f'helper send {agent_number(story, helper.id)} "One more job"', actor=story.agent)
    story.expect_refusal(f"helper start {RESEARCHER_PROFILE.name} --fresh 'A second reader' --brief 'Read src/other.py' --environment main", f"1 of {RESEARCHER_PROFILE.name} run", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_start_with_an_idle_helper_is_refused_with_its_send_line(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_refusal(f'helper start {RESEARCHER_PROFILE.name} --brief "Read src/till.py" --environment main', f'helper {agent_number(story, helper.id)} is idle: journal helper send {agent_number(story, helper.id)} "<job>"', actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_fresh_with_a_reason_starts_a_new_helper_and_keeps_the_reason(played):
    story = played(EndedHelper)
    resumable_session(story, helper_agent(story))
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(f"helper start {RESEARCHER_PROFILE.name} --fresh 'A second reader' --brief 'Read src/other.py' --environment main", actor=story.agent)
    job = story.newest_row(HelperJob)
    story.expect_rows(job.new_agent_reason == "A second reader")
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_an_idle_helper_on_another_model_or_with_its_session_gone_is_not_offered(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    kept = story.container.get(KeptHelpers)
    story.expect_rows(kept.idle(ProfileModel("", "", f"{RESEARCHER_PROFILE.name}"), Occupant.COLD_ROTATION) == ())
    resumable_session(story, helper)
    story.expect_rows(kept.idle(ProfileModel("", "", f"{RESEARCHER_PROFILE.name}"), Occupant.COLD_ROTATION)[0].id == helper.id, kept.idle(ProfileModel("", "another-model", f"{RESEARCHER_PROFILE.name}"), Occupant.COLD_ROTATION) == ())


def test_a_nearly_full_session_is_not_offered(played, monkeypatch):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    kept = story.container.get(KeptHelpers)
    story.expect_rows(kept.idle(ProfileModel("", "", f"{RESEARCHER_PROFILE.name}"), Occupant.COLD_ROTATION)[0].id == helper.id)
    monkeypatch.setattr(ClaudeCodeProvider, "context_window", lambda provider, home, session: ContextWindow(80, 1000))
    story.expect_rows(kept.idle(ProfileModel("", "", f"{RESEARCHER_PROFILE.name}"), Occupant.COLD_ROTATION) == ())


def test_two_sends_to_one_idle_helper_run_one_session(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(f'helper send {agent_number(story, helper.id)} "One more job"', actor=story.agent)
    story.expect_refusal(f'helper send {agent_number(story, helper.id)} "And another"', "is busy with a job", actor=story.agent)
    open_jobs = story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).matching(IsNull("ended_at")).every_row(TEST_ROWS_REASON)
    story.expect_rows(len(tuple(open_jobs)) == 1)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_new_main_takes_over_an_idle_helper_and_gets_its_report(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    story.run(f"agent end {story.agent.id}", actor=story.user)
    second = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.expect_success(f'helper send {agent_number(story, helper.id)} "One more job"', actor=second)
    job = story.newest_row(HelperJob, helper_id=helper.id)
    story.expect_rows(helper_agent(story).parent_id == second.id, job.session_agent_id == second.id)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_steering_or_new_job(played):
    story = played(StartedHelper)
    helper = helper_agent(story)
    story.expect_refusal(f'helper send {agent_number(story, helper.id)} "Unrelated work"', f"helper {agent_number(story, helper.id)} is busy", actor=story.agent)
    story.expect_success(f'helper send {agent_number(story, helper.id)} "Also read the tax" --steer', actor=story.agent)
    jobs = tuple(story.story_rows(HelperJob, helper_id=helper.id))
    story.expect_rows(len(jobs) == 1, "Also read the tax" in jobs[0].brief)


def test_same_reviewer_same_plan_is_refused(played):
    story = played(UserBuilder)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), request_count=2)
    story.expect_success(f"helper start {PLAN_REVIEWER_PROFILE.name} --plan 7 --brief 'Review plan 7' --environment main", actor=story.agent)
    reviewer = helper_agent(story)
    job = story.first_row(HelperJob, helper_id=reviewer.id)
    story.expect_rows(job.review_plan_id == 7)
    story.expect_success(f"agent end {reviewer.id}", actor=story.user)
    story.run_listeners()
    resumable_session(story, reviewer)
    story.expect_refusal(f'helper send {agent_number(story, reviewer.id)} "Review it again" --plan 7', "reviewed plan 7", actor=story.agent)
    story.expect_success(f'helper send {agent_number(story, reviewer.id)} "Review plan 8" --plan 8', actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()


def test_a_fresh_start_beside_a_kept_idle_helper_is_never_held_back_by_how_many_are_kept(played):
    story = played(EndedHelper)
    story.expect_success(f'setting set {HELPER_PROFILE_LIMITS} \'["{RESEARCHER_PROFILE.name}:4"]\' --project', actor=story.user)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    outcome = story.run(f'helper start {RESEARCHER_PROFILE.name} --fresh "A second reader" --brief "Read src/other.py" --environment main', actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows("which is the limit" not in outcome.output_text and "retire one" not in outcome.output_text, detail=outcome.output_text)


def test_the_agent_mix_counts_the_jobs_and_the_idle_agents_of_each_model(played):
    story = played(ReportedHelper)
    helper = helper_agent(story)
    story.expect_text("agent mix", f"{RESEARCHER_PROFILE.name}, {helper.program_model}: jobs 1, kept 1, idle", actor=story.agent)


def test_an_idle_helper_on_another_model_is_not_reused_and_a_start_on_its_own_model_is(played):
    story = played(EndedHelper)
    helper = helper_agent(story)
    resumable_session(story, helper)
    different_model = "opus" if helper.program_model != "opus" else "sonnet"
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), answer=b"started 703\n", request_count=2)
    story.expect_refusal(f'helper start {RESEARCHER_PROFILE.name} --model {helper.program_model} --brief "Read src/queue.py" --environment main', f"helper {agent_number(story, helper.id)} is idle", actor=story.agent)
    started = story.new_row_id(f'helper start {RESEARCHER_PROFILE.name} --model {different_model} --brief "Read src/tax.py" --environment main', actor=story.agent)
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows(started != helper.id, story.row(Agent, started).program_model == different_model, detail=f"{started} {helper.id}")
