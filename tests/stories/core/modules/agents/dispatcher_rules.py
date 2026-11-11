import json

import pytest

from engine.caller.process_table import ProcessTable
from engine.journal.journal_home import LAUNCHER_SOCKET
from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.helpers.support.helper_resume import HelperResume
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, StartedHelper, helper_agent, resumable_session
from tests.stories.core.modules.helpers.helper_reports import LINES
from tests.stories.core.support.agent_labels import agent_number

PROGRAM_RUNS = b"running\n"
STARTED = b"started 701\n"
START_FAILED = "could not start"
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
    story.expect_rows(helper_agent(story).pid is None, START_FAILED not in main_lines(story), "standing: running" in standing(story), detail=standing(story) + main_lines(story))


def test_547_two_starts_of_one_agent_at_once_start_one_program_and_the_other_is_told_it_runs(ended_helper):
    story = ended_helper
    held = launcher(story, request_count=2, answers=(STARTED, PROGRAM_RUNS))
    resume = story.container.get(HelperResume)
    answers = [resume.resume(helper_agent(story), JOB), resume.resume(helper_agent(story), JOB)]
    held.drain_requests()
    story.expect_rows(sorted(answer.value for answer in answers) == ["running", "started"], helper_agent(story).pid == 701, "standing: running" in standing(story),
                      detail=f"{answers} {standing(story)}")


def test_549_after_a_restart_an_agent_whose_recorded_process_is_not_listed_is_found_again_from_the_launcher_and_not_started_twice(new_story, monkeypatch):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f"agent edit {agent_number(story, helper_agent(story).id)} {RECORDED_PROCESS}", actor=story.user)
    held = launcher(story, answer=PROGRAM_RUNS, request_count=0)
    monkeypatch.setattr(ProcessTable, "rows", lambda table: [])
    story.tick(story.row(Agent, story.agent.id).session)
    story.run_listeners()
    story.expect_rows(helper_agent(story).ended_at is None, [request for request in held.starts if "command" in request] == [], "standing: running" in standing(story),
                      detail=f"{held.requests} {standing(story)}")


def test_550_a_start_that_cannot_reach_the_launcher_reads_as_failed_and_leaves_one_line_however_many_ticks_follow(ended_helper):
    story = ended_helper
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    for _ in range(3):
        story.run_listeners()
        story.tick(story.row(Agent, story.agent.id).session)
    story.expect_rows(main_lines(story).count(START_FAILED) == 1, "standing: failed" in standing(story), detail=main_lines(story) + standing(story))


def test_557_the_standing_of_an_agent_reads_the_same_in_its_own_command_in_the_list_and_on_its_row(new_story):
    story = new_story(fixture=StartedHelper)
    number = agent_number(story, helper_agent(story).id)
    launcher(story, answer=PROGRAM_RUNS, request_count=0)
    listed = {row["number"]: row for row in json.loads(story.run("agent list --json --environment main", actor=story.user).output_text)["rows"]}
    story.expect_rows("standing: running" in standing(story), listed[number]["standing"] == "running", detail=f"{standing(story)} {listed[number]}")
    story.expect_text(f"agent show {number} --environment main", "standing: running", actor=story.user)
    story.expect_success(f'agent stop {number} --environment main', actor=story.user)
    story.expect_text(f"agent show {number} --environment main", "standing: ended", "reason: stopped by a person", actor=story.user)
    story.expect_rows("standing: ended" in standing(story), "reason: stopped by a person" in standing(story), detail=standing(story))
