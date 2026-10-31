from core.base.actor import CORE_ACTOR_ID
from core.base.caller.caller_request import CallerRequest
from core.base.cli.console import REFUSED_CODE, USAGE_CODE
from core.base.caller.process_row import ProcessRow
from core.base.timestamp import Timestamp
from tests.stories.core.support.fixtures import AgentWithProcess, MainEnvironment

AGENT_START_TIME = Timestamp.parsed("2026-10-31T09:00:00+00:00")
REUSED_START_TIME = Timestamp.parsed("2026-10-31T11:00:00+00:00")
TASK_LINE = 'task make "Fix the cart"'


def agent_with_pid(new_story):
    story = new_story(fixture=AgentWithProcess)
    return story, story.agent.id


def test_a_session_variable_naming_an_open_agent_runs_the_line_as_that_agent(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.expect_requested_success(TASK_LINE, CallerRequest({"JOURNAL_AGENT_SESSION": "s-7"}), f"creator_id: {agent_id}", "environment_id: 1")


def test_a_session_variable_naming_no_open_agent_is_refused_and_never_runs_as_anyone(new_story):
    story, _ = agent_with_pid(new_story)
    story.expect_requested_exit(TASK_LINE, CallerRequest({"JOURNAL_AGENT_SESSION": "s-9"}), USAGE_CODE, "which is no open agent")
    story.expect_success("task list", "nothing found")


def test_an_ancestor_process_whose_pid_and_start_match_an_open_agent_names_it(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.use_processes(ProcessRow(900, 700, REUSED_START_TIME), ProcessRow(700, 1, AGENT_START_TIME), ProcessRow(1, 0, AGENT_START_TIME))
    story.expect_requested_success(TASK_LINE, CallerRequest(pid=900), f"creator_id: {agent_id}")


def test_a_reused_pid_with_another_start_time_names_no_agent(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.use_processes(ProcessRow(900, 700, REUSED_START_TIME), ProcessRow(700, 1, REUSED_START_TIME))
    story.expect_requested_success(f"{TASK_LINE} --environment main", CallerRequest(pid=900), f"creator_id: {CORE_ACTOR_ID}")


def test_with_no_agent_the_person_of_the_login_name_runs_in_the_environment_holding_the_folder(new_story):
    story = new_story(fixture=MainEnvironment)
    person_id = story.new_row_id('actor make user "ada"')
    story.expect_requested_success(TASK_LINE, CallerRequest({"USER": "ada"}, "/work/journal/src"), f"creator_id: {person_id}", "environment_id: 1")


def test_the_deepest_environment_folder_holding_the_working_folder_wins(new_story):
    story = new_story(fixture=MainEnvironment)
    story.run("environment make web /work/journal/web")
    story.expect_requested_success(TASK_LINE, CallerRequest(folder="/work/journal/web/src"), "environment_id: 2")


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


def test_an_ended_agent_clears_its_process_and_a_command_from_that_pid_names_no_agent(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.use_processes(ProcessRow(900, 700, REUSED_START_TIME), ProcessRow(700, 1, AGENT_START_TIME))
    story.run(f"agent end {agent_id}")
    story.expect_absent(f"agent show {agent_id}", "pid: 700", f"process_started_at: {AGENT_START_TIME.text}")
    story.expect_requested_success(f"{TASK_LINE} --environment main", CallerRequest(pid=900), f"creator_id: {CORE_ACTOR_ID}")


def test_an_agent_ends_once(new_story):
    story, agent_id = agent_with_pid(new_story)
    story.run(f"agent end {agent_id}")
    story.expect_refusal(f"agent end {agent_id}", "has ended already")


def test_a_pid_given_without_its_start_gets_the_start_the_process_table_reads(new_story):
    story = new_story(fixture=MainEnvironment)
    story.use_processes(ProcessRow(700, 1, AGENT_START_TIME))
    agent_id = story.new_row_id("agent start s-8 claude main --pid 700 --environment main")
    story.expect_success(f"agent show {agent_id}", "pid: 700", f"process_started_at: {AGENT_START_TIME.text}")
