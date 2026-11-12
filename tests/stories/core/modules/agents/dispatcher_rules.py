import ast
import json
from pathlib import Path

import pytest

from engine.caller.process_table import ProcessTable
from engine.command.bus import Bus
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.support.agent_standing import AgentStanding
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from core.modules.agents.support.receivers import Receivers
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.support.helper_resume import HelperResume
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, StartedHelper, helper_agent, resumable_session
from tests.stories.core.modules.helpers.helper_reports import LINES
from tests.stories.core.modules.agents.support import sample_suite_start
from tests.stories.core.modules.agents.support.sample_suite_start import SampleSuiteStart
from tests.stories.core.modules.agents.support.strict_policy import STRICT_POLICY, StrictPolicy
from tests.stories.core.support.agent_labels import agent_number

PROGRAM_RUNS = b"running\n"
STARTED = b"started 701\n"
STOPPED = b"stopped\n"
NO_PROGRAM = b"\n"
START_FAILED = "could not start"
PRIVATE_PARTS = ("launcher", "support.agent_program", "agent_dispatcher", "program_transport")
RECORDED_PROCESS = "--pid 700 --process-started-at 2026-10-31T09:00:00+00:00"


def standing(story) -> str:
    return story.run(f"agent standing {agent_number(story, helper_agent(story).id)} --environment main", actor=story.user).output_text


def main_lines(story) -> str:
    return story.run(LINES.format(agent=story.agent.id)).output_text


def launcher(story, **answers) -> FakeLauncher:
    return FakeLauncher.listening(story.home.socket(LAUNCHER_SOCKET), **answers)


@pytest.fixture
def ended_helper(new_story, monkeypatch):
    story = new_story(fixture=EndedHelper)
    resumable_session(story, helper_agent(story), monkeypatch)
    return story


def test_546_a_job_for_an_agent_whose_program_the_launcher_still_holds_starts_nothing_and_the_agent_reads_as_running(ended_helper):
    story = ended_helper
    held = launcher(story, answer=PROGRAM_RUNS)
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    held.drain_requests()
    shown, lines = standing(story), main_lines(story)
    story.expect_rows(helper_agent(story).pid is None, START_FAILED not in lines, "standing: running" in shown, detail=shown + lines)


def test_547_two_starts_of_one_agent_at_once_start_one_program_and_the_other_is_told_it_runs(ended_helper):
    story = ended_helper
    held = launcher(story, request_count=2, answers=(STARTED, PROGRAM_RUNS))
    resume = story.container.get(HelperResume)
    answers = [resume.resume(helper_agent(story), JOB), resume.resume(helper_agent(story), JOB)]
    held.drain_requests()
    shown = standing(story)
    story.expect_rows(sorted(answer.value for answer in answers) == ["running", "started"], helper_agent(story).pid == 701, "standing: running" in shown, detail=f"{answers} {shown}")


def test_549_after_a_restart_an_agent_whose_recorded_process_is_not_listed_is_found_again_from_the_launcher_and_not_started_twice(new_story, monkeypatch):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent edit {agent_number(story, helper_agent(story).id)} {RECORDED_PROCESS}", actor=story.user)
    held = launcher(story, answer=PROGRAM_RUNS, request_count=0)
    monkeypatch.setattr(ProcessTable, "rows", lambda table: [])
    story.tick(story.row(Agent, story.agent.id).session)
    story.run_listeners()
    shown = standing(story)
    story.expect_rows(helper_agent(story).ended_at is None, [request for request in held.starts if "command" in request] == [], "standing: running" in shown,
                      detail=f"{held.requests} {shown}")


def test_550_a_start_that_cannot_reach_the_launcher_reads_as_failed_and_leaves_one_line_however_many_ticks_follow(ended_helper):
    story = ended_helper
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    for _ in range(3):
        story.run_listeners()
        story.tick(story.row(Agent, story.agent.id).session)
    shown, lines = standing(story), main_lines(story)
    story.expect_rows(lines.count(START_FAILED) == 1, "standing: failed" in shown, detail=lines + shown)


def test_557_the_standing_command_reads_running_and_after_a_stop_through_the_dispatcher_ended_with_who_stopped_it(new_story):
    story = new_story(fixture=StartedHelper)
    number = agent_number(story, helper_agent(story).id)
    launcher(story, request_count=0, answers=(PROGRAM_RUNS, STOPPED, NO_PROGRAM))
    story.expect_text(f"agent standing {number} --environment main", "standing: running", actor=story.user)
    story.expect_success(f"agent stop-program {number} --environment main", "stop: program_ended", actor=story.user)
    story.expect_text(f"agent standing {number} --environment main", "standing: ended", "reason: stopped by a user", actor=story.user)


def test_557_the_list_of_agents_and_the_row_of_an_agent_carry_the_standing_its_own_command_prints(new_story):
    story = new_story(fixture=StartedHelper)
    number = agent_number(story, helper_agent(story).id)
    launcher(story, answer=PROGRAM_RUNS, request_count=0)
    listed = {row["number"]: row for row in json.loads(story.run("agent list --json --environment main", actor=story.user).output_text)["rows"]}
    story.expect_rows(listed[number].get("standing") == "running", detail=str(listed[number]))
    story.expect_text(f"agent show {number} --environment main", "standing: running", actor=story.user)


def test_551_a_suite_starts_an_agent_by_the_public_command_reads_its_standing_by_the_public_query_and_imports_no_launcher(ended_helper):
    story = ended_helper
    launcher(story, request_count=0, answers=(STARTED, PROGRAM_RUNS))
    suite = SampleSuiteStart(story.container.get(Bus), story.container.get(AgentStanding))
    helper = helper_agent(story)
    started = suite.start(helper.id, str(story.container.get(AgentFolders).folder(helper)))
    imported = [node.module for node in ast.walk(ast.parse(Path(sample_suite_start.__file__).read_text())) if isinstance(node, ast.ImportFrom) and node.module]
    private = [name for name in imported if any(word in name for word in PRIVATE_PARTS)]
    story.expect_rows(started is Dispatch.STARTED, helper_agent(story).pid == 701, suite.is_running(helper.id), private == [], detail=f"{started} {imported}")


def test_554_a_suite_binds_its_own_policy_which_decides_that_an_ended_agent_is_not_gone_for_good_and_starts_no_program(new_story):
    story = new_story(STRICT_POLICY, fixture=EndedHelper)
    asked = launcher(story, request_count=0)
    policy, helper = story.container.get(DispatchPolicy), helper_agent(story)
    with policy.lock(helper.session) as available:
        story.expect_rows(isinstance(policy, StrictPolicy), not available, policy.is_wanted(helper), detail=f"the bound policy is {type(policy).__name__}")
    story.expect_rows(story.container.get(Receivers).receiver(helper.id).id == helper.id, asked.requests == [], detail=str(asked.requests))
