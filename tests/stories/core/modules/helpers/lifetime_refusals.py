import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.agents.agent_kind_controls import ALLOWED_MODELS, set_options
from tests.stories.core.modules.helpers.helper_jobs import JOB, helper_agent, read_jobs, resumable_session
from tests.stories.core.modules.helpers.occupant_rotation import job_launch
from tests.stories.core.modules.helpers.support.rotating_helper import EndedEachLaunchHelper, story_with_profile_file
from tests.stories.core.support.agent_labels import agent_number

CODEX_MODELS = "codex gpt-6-luna,codex gpt-6.1-terra,codex gpt-6.1-sol,codex gpt-6-astra"
UNUSED_MODEL = "claude fable"


@pytest.fixture
def rotating(new_story, monkeypatch):
    story = story_with_profile_file(new_story, EndedEachLaunchHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    return story


def job_line(story) -> str:
    return f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"'


def test_resume_switched_off_for_helpers_refuses_a_job_for_an_idle_each_launch_agent(rotating):
    helper = helper_agent(rotating)
    set_options(rotating, "helper allow_resume=off")
    rotating.expect_refusal(job_line(rotating), "stopped helper sessions may not resume", actor=rotating.agent)
    current = helper_agent(rotating)
    rotating.expect_rows(current.session == helper.session, current.program == helper.program, len(read_jobs(rotating, helper)) == 1)


def test_new_sessions_switched_off_for_the_profile_do_not_stop_a_new_occupant(rotating):
    helper = helper_agent(rotating)
    set_options(rotating, "helper:rotating allow_new=off")
    command = job_launch(rotating)["command"]
    rotating.expect_rows(helper_agent(rotating).session != helper.session, "--resume" not in command, len(read_jobs(rotating, helper)) == 2, detail=str(command[-4:]))


def test_a_model_the_environment_does_not_allow_makes_the_next_occupant_run_on_the_other_program(rotating):
    helper = helper_agent(rotating)
    rotating.expect_success(f'setting set {ALLOWED_MODELS} "{CODEX_MODELS}" --project', actor=rotating.user)
    launch = job_launch(rotating)
    current = helper_agent(rotating)
    rotating.expect_rows(launch["command"][0] == "codex", current.id == helper.id, current.program == "codex", f"codex {current.program_model}" in CODEX_MODELS,
                         detail=str(launch["command"][:4]))


def test_when_no_program_has_an_allowed_model_the_job_is_refused_as_a_start_is_and_nothing_changes(rotating):
    helper = helper_agent(rotating)
    rotating.expect_rows(f"claude {helper.program_model}" != UNUSED_MODEL, detail=helper.program_model)
    rotating.expect_success(f'setting set {ALLOWED_MODELS} "{UNUSED_MODEL}" --project', actor=rotating.user)
    rotating.expect_refusal(job_line(rotating), "claude has no allowed automatic model", actor=rotating.agent)
    current = helper_agent(rotating)
    rotating.expect_rows(current.session == helper.session, current.program == helper.program, len(read_jobs(rotating, helper)) == 1)


def test_a_worker_that_sends_a_job_to_the_each_launch_agent_is_refused_and_starts_no_occupant(rotating):
    helper = helper_agent(rotating)
    worker = Actor(rotating.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    rotating.expect_refusal(f"{job_line(rotating)} --reason needed", "The main agent was asked to review this request", actor=worker)
    rotating.expect_rows(helper_agent(rotating).session == helper.session, len(read_jobs(rotating, helper)) == 1)
