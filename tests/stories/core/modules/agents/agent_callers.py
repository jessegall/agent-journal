from core.modules.tasks.models.task import Task
from tests.stories.core.support.agent_labels import agent_number
from engine.actor.actor import CORE_ACTOR_ID
from engine.enums.actor_type import ActorType
from core.modules.actors.models.actor_record import ActorRecord
from engine.caller.caller_request import CallerRequest
from engine.cli.console import REFUSED_CODE, USAGE_CODE
from engine.caller.process_row import ProcessRow
from engine.time.timestamp import Timestamp
from tests.stories.core.support.fixtures import ProcessAgent, MainEnvironment
from tests.stories.core.modules.agents.support.caller_fixtures import LoginUser

AGENT_START_TIME = Timestamp.parsed("2026-10-31T09:00:00+00:00")
REUSED_START_TIME = Timestamp.parsed("2026-10-31T11:00:00+00:00")
TASK_LINE = 'task make "Fix the cart"'


def expect_made_by_no_agent(story) -> None:
    creator = story.row(ActorRecord, story.story_rows(Task)[-1].creator_id)
    story.expect_rows(creator.type is not ActorType.AGENT, detail=str(creator))


def agent_with_pid(new_story):
    story = new_story(fixture=ProcessAgent)
    return story, story.agent.id


def test_a_session_variable_naming_an_open_agent_runs_the_line_as_that_agent(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.expect_requested_success(TASK_LINE, CallerRequest({"JOURNAL_AGENT_SESSION": "s-7"}), f"creator_id: {agent_id}", "environment_id: 1")


def test_a_session_variable_naming_no_open_agent_is_refused_and_never_runs_as_anyone(new_story):
    story, _ = agent_with_pid(new_story)
    story.expect_requested_exit(TASK_LINE, CallerRequest({"JOURNAL_AGENT_SESSION": "s-9"}), USAGE_CODE, "which is no open agent")
    story.expect_rows(story.story_rows(Task) == ())


def test_a_run_the_journal_started_keeps_running_as_its_agent_after_the_agent_has_stopped(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.expect_success(f"agent end {agent_id}")
    story.expect_requested_exit(TASK_LINE, CallerRequest({"JOURNAL_AGENT_SESSION": "s-7"}), USAGE_CODE, "which is no open agent")
    story.expect_requested_success(TASK_LINE, CallerRequest({"JOURNAL_AGENT_SESSION": "s-7", "JOURNAL_RUNNER_PROCESS": "12"}), f"creator_id: {agent_id}", "environment_id: 1")


def test_a_shell_of_an_agent_program_no_agent_holds_is_never_taken_for_the_person(new_story):
    story = new_story(fixture=LoginUser)
    story.expect_requested_success(TASK_LINE, CallerRequest({"CLAUDE_CODE_SESSION_ID": "s-9", "USER": "ada"}, "/work/journal/src"), f"creator_id: {CORE_ACTOR_ID}", "environment_id: 1")


def test_a_reused_pid_with_another_start_time_names_no_agent(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.use_processes(ProcessRow(900, 700, REUSED_START_TIME), ProcessRow(700, 1, REUSED_START_TIME))
    story.expect_requested_success(f"{TASK_LINE} --environment main", CallerRequest(pid=900))
    expect_made_by_no_agent(story)


def test_a_symlinked_working_folder_finds_the_environment_of_the_folder_it_points_to(new_story):
    story = new_story(fixture=MainEnvironment)
    real_folder, linked_folder = story.home.folder / "checkout", story.home.folder / "linked"
    real_folder.mkdir()
    linked_folder.symlink_to(real_folder)
    story.run(f"environment make linked {real_folder}")
    story.expect_requested_success(TASK_LINE, CallerRequest(folder=str(linked_folder)), "environment_id: 2")


def test_an_explicit_environment_overrides_the_working_folder(new_story):
    story = new_story(fixture=MainEnvironment)
    story.run("environment make web /work/journal/web")
    story.expect_requested_success(f"{TASK_LINE} --environment main", CallerRequest(folder="/work/journal/web"), "environment_id: 1")


def test_a_folder_no_environment_holds_runs_in_no_environment(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_requested_exit(TASK_LINE, CallerRequest(folder="/elsewhere"), REFUSED_CODE, "needs an environment")


def test_an_ended_agent_preserves_its_process_identity_but_a_command_from_it_names_no_agent(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.use_processes(ProcessRow(900, 700, REUSED_START_TIME), ProcessRow(700, 1, AGENT_START_TIME))
    story.run(f"agent end {agent_id}")
    story.expect_text(f"agent show {agent_number(story, agent_id)}", "pid: 700", f"process_started_at: {AGENT_START_TIME.text}")
    story.expect_requested_success(f"{TASK_LINE} --environment main", CallerRequest(pid=900))
    expect_made_by_no_agent(story)


def test_an_agent_ends_once(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.run(f"agent end {agent_id}")
    story.expect_refusal(f"agent end {agent_id}", "has ended already")


def test_a_pid_given_without_its_start_gets_the_start_the_process_table_reads(new_story):
    story = new_story(fixture=MainEnvironment)
    story.use_processes(ProcessRow(700, 1, AGENT_START_TIME))
    agent_id = story.new_row_id("agent start s-8 claude main --pid 700 --environment main")
    story.expect_success(f"agent show {agent_number(story, agent_id)}", "pid: 700", f"process_started_at: {AGENT_START_TIME.text}")
