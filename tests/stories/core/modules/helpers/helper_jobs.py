from tests.stories.core.support.agent_labels import agent_number
from engine.database.database import Database
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.claude_code.providers.claude_code_provider import CONFIG_VARIABLE
from core.modules.claude_code.providers.support.claude_folder_name import ClaudeFolderName
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder

JOB = "Now read the listener side."
START = 'helper start journal-researcher --brief "Read src/cart.py" --environment main'


class StartedHelper(StoryFixture):
    """A main agent with a person beside it and one helper of journal-researcher on src/cart.py."""

    parent = UserBuilder

    def steps(self, story):
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        story.run(START, actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()


def helper_agent(story):
    return next(story.container.get(Queries).query(Agent).filter(role="helper").all_rows())


def resumable_session(story, helper, monkeypatch) -> None:
    """Puts the helper's Claude transcript where a resume in its folder finds it."""
    monkeypatch.setenv(CONFIG_VARIABLE, str(story.home.folder.parent / "claude-config"))
    project = story.container.get(AgentFolders).folder(helper)
    transcript = story.home.folder.parent / "claude-config" / "projects" / ClaudeFolderName.folder_name(project) / f"{helper.session}.jsonl"
    transcript.parent.mkdir(parents=True, exist_ok=True)
    transcript.write_text("{}\n")


def read_jobs(story, helper):
    return list(story.container.get(Queries).query(HelperJob).filter(helper_id=helper.id).oldest().all_rows())


class EndedHelper(StoryFixture):
    """A helper of journal-researcher that ended after its job on src/cart.py."""

    parent = StartedHelper

    def steps(self, story):
        story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
        story.run_listeners()


def test_a_send_to_a_running_helper_adds_to_its_open_job(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f'helper send {agent_number(story, helper.id)} "{JOB}" --steer', actor=story.agent)
    jobs = read_jobs(story, helper)
    story.expect_rows(len(jobs) == 1, JOB in jobs[0].brief)
    story.expect_text(f"agent-line list --agent {helper.id}", JOB)


def test_a_send_to_an_ended_helper_opens_a_new_job_and_resumes_it(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    resumable_session(story, helper_agent(story), monkeypatch)
    story.expect_success(f'helper send {agent_number(story, helper.id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    story.expect_rows(len(read_jobs(story, helper)) == 2, helper.session in " ".join(launcher.requests[0]["command"]), JOB in " ".join(launcher.requests[0]["command"]))
    story.expect_rows([job.program for job in read_jobs(story, helper)] == [helper.program, helper.program], bool(helper.program))


def test_a_send_refuses_an_agent_that_is_no_helper(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_refusal(f'helper send {agent_number(story, story.agent.id)} "{JOB}"', "is no helper", actor=story.agent)


def test_another_agent_may_not_send_to_a_helper_and_the_parent_is_named(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    second_worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    story.expect_refusal(f'helper send {agent_number(story, helper.id)} "{JOB}" --reason needed', "The main agent was asked to review this request", actor=second_worker)


def test_a_person_may_send_to_a_helper(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.user)


def test_a_stop_ends_the_helper_and_its_job(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_success(f"helper stop {agent_number(story, helper.id)}", actor=story.agent)
    story.run_listeners()
    job = read_jobs(story, helper)[0]
    story.expect_rows(job.ended_at is not None, job.returned == "Stopped")


def test_another_agent_may_not_stop_a_helper(new_story):
    story = new_story(fixture=StartedHelper)
    second_worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    story.expect_refusal(f"helper stop {agent_number(story, helper_agent(story).id)} --reason needed", "The main agent was asked to review this request", actor=second_worker)


def test_a_helper_that_ends_closes_its_job(new_story):
    story = new_story(fixture=EndedHelper)
    story.expect_rows(read_jobs(story, helper_agent(story))[0].ended_at is not None)


def test_a_job_naming_files_an_ended_helper_knows_goes_to_that_helper(new_story):
    story = new_story(fixture=EndedHelper)
    FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_refusal(START, f"journal helper send {agent_number(story, helper_agent(story).id)}", actor=story.agent)


def test_fresh_starts_a_new_helper_on_files_an_ended_one_knows(new_story):
    story = new_story(fixture=EndedHelper)
    FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success(f"{START} --fresh 'A second reader'", actor=story.agent)


def test_a_job_on_other_files_starts_a_new_helper(new_story):
    story = new_story(fixture=EndedHelper)
    FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success('helper start journal-researcher --brief "Read src/queue.py" --environment main', actor=story.agent)


def test_a_helper_that_ran_as_a_program_subagent_is_refused_a_new_job(new_story):
    story = new_story(fixture=EndedHelper)
    helper = helper_agent(story)
    story.container.get(Database).connection.execute("UPDATE agents SET profile = '' WHERE id = ?", [helper.id])
    story.expect_refusal(f'helper send {agent_number(story, helper.id)} "{JOB}"', "start a new helper", actor=story.agent)
