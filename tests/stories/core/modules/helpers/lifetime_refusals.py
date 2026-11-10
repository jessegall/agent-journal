import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.actor.actor import Actor
from engine.query.queries import Queries
from core.modules.profiles.support.profile_files import ProfileFiles
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.agents.agent_kind_controls import ALLOWED_MODELS, set_options
from tests.stories.core.modules.helpers.helper_jobs import JOB, helper_agent, read_jobs, resumable_session
from tests.stories.core.modules.helpers.occupant_rotation import job_launch
from tests.stories.core.modules.helpers.support.rotating_helper import START_ROTATING, EndedEachLaunchHelper, story_with_profile_file
from tests.stories.core.support.agent_labels import agent_number

CODEX_MODELS = "codex gpt-6-luna,codex gpt-6.1-terra,codex gpt-6.1-sol,codex gpt-6-astra"
UNUSED_MODEL = "claude fable"
TILL_START = START_ROTATING.replace("src/cart.py", "src/till.py")


@pytest.fixture
def rotating(new_story, monkeypatch):
    story = story_with_profile_file(new_story, EndedEachLaunchHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    return story


def job_line(story) -> str:
    return f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"'


def test_agent_with_resume_disabled_for_helpers_refuses_a_job_for_an_idle_each_launch_agent(rotating):
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


def test_a_start_of_the_profile_is_refused_with_the_send_line_of_the_idle_agent_though_its_conversation_is_gone(new_story):
    story = story_with_profile_file(new_story, EndedEachLaunchHelper)
    number = agent_number(story, helper_agent(story).id)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_refusal(TILL_START, f'helper {number} is idle: journal helper send {number} "<job>"', actor=story.agent)
    story.expect_success(f'{TILL_START} --fresh "A second view"', actor=story.agent)
    launcher.drain_requests()
    helpers = list(story.container.get(Queries).query(Agent).filter(role="helper").all_rows())
    story.expect_rows(len(helpers) == 2, detail=str(helpers))


MERGER_CONTINUE = "profile save journal-merger --occupant continue --reason needed"
WORKER_ROTATION = "profile save journal-worker --occupant each-launch --reason needed"
ROTATING_CONTINUE = "profile save rotating --occupant continue --reason needed"


def profile_files(story) -> dict[str, bytes]:
    folder = story.container.get(ProfileFiles).path("rotating").parent
    return {path.name: path.read_bytes() for path in sorted(folder.iterdir())}


def agent_jobs_and_files(story) -> tuple[str, str, dict[str, bytes]]:
    helper = helper_agent(story)
    shown = story.run(f"agent show {agent_number(story, helper.id)} --environment main --json", actor=story.user).output_text
    return shown, story.run(f"helper-job list --helper {helper.id} --oldest --json", actor=story.user).output_text, profile_files(story)


def worker_actor(story) -> Actor:
    return Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)


def helper_actor(story) -> Actor:
    return Actor(helper_agent(story).id, ActorType.AGENT)


def test_a_worker_that_sets_the_merger_to_continue_is_refused_and_no_profile_file_changes(rotating):
    files = profile_files(rotating)
    rotating.expect_refusal(MERGER_CONTINUE, "cannot save a profile", actor=worker_actor(rotating))
    rotating.expect_text("profile show journal-merger --json", '"occupant": "each-launch"', actor=rotating.user)
    rotating.expect_rows(profile_files(rotating) == files)


def test_a_helper_that_gives_the_worker_profile_an_occupant_is_refused_and_no_profile_file_changes(rotating):
    files = profile_files(rotating)
    rotating.expect_refusal(WORKER_ROTATION, "cannot save a profile", actor=helper_actor(rotating))
    rotating.expect_absent("profile show journal-worker --json", '"occupant"', actor=rotating.user)
    rotating.expect_rows(profile_files(rotating) == files)


def test_the_main_agent_asks_a_person_to_save_the_merger_profile_and_a_person_saves_it_directly(rotating):
    rotating.expect_refusal(MERGER_CONTINUE, "A person was asked in the dock", actor=rotating.agent)
    rotating.expect_text("profile show journal-merger --json", '"occupant": "each-launch"', actor=rotating.user)
    rotating.expect_success(MERGER_CONTINUE, actor=rotating.user)
    rotating.expect_text("profile show journal-merger --json", '"occupant": "continue"', actor=rotating.user)


def agent_with_resume_disabled(story) -> Actor:
    set_options(story, "helper allow_resume=off")
    return story.agent


def agent_with_unusable_models(story) -> Actor:
    story.expect_success(f'setting set {ALLOWED_MODELS} "{UNUSED_MODEL}" --project', actor=story.user)
    return story.agent


@pytest.mark.parametrize("refused_actor,line", [(agent_with_resume_disabled, ""), (agent_with_unusable_models, ""), (worker_actor, ""), (worker_actor, ROTATING_CONTINUE), (helper_actor, ROTATING_CONTINUE)])
def test_after_each_refusal_the_agent_its_jobs_and_the_profile_files_are_what_they_were(rotating, refused_actor, line):
    earlier_state = agent_jobs_and_files(rotating)
    actor = refused_actor(rotating)
    outcome = rotating.run(line or f"{job_line(rotating)} --reason needed", actor=actor)
    rotating.expect_rows(outcome.code == 1, agent_jobs_and_files(rotating) == earlier_state, detail=outcome.output_text)
