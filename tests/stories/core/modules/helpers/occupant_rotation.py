import json
import shutil
from datetime import timedelta

import pytest

from core.modules.agents.testing.fake_launcher import FakeLauncher
from core.modules.memories.support.memory_nudges import START_MEMORIES
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import JOB, helper_agent, read_jobs
from tests.stories.core.modules.helpers.program_split import helper_split_story, helper_viewer
from tests.stories.suites.coding.modules.workers.support.program_split import set_split
from tests.stories.core.modules.helpers.support.rotating_helper import ROTATING_BODY, SAVE_ROTATING, START_ROTATING, EndedEachLaunchHelper
from tests.stories.core.support.agent_labels import agent_number

REPORT_STEP_TEXT = "When the job is done, stop with your report as your last words."
__all__ = ["helper_split_story", "helper_viewer"]

MEMORY_TEXT = "The cart rounds each line before it adds them"


@pytest.fixture
def rotating(new_story):
    return new_story(fixture=EndedEachLaunchHelper)


def job_launch(story, actor=None) -> dict:
    launcher = FakeLauncher.listening(story.home.socket("launcher"), answer=b"started 701\n")
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=actor or story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_rows(len(launcher.requests) == 1, detail=str(launcher.requests))
    return launcher.requests[0]


def job_rows(story) -> list[dict]:
    return json.loads(story.run(f"helper-job list --helper {helper_agent(story).id} --json", actor=story.user).output_text)["rows"]


def test_the_first_start_gives_the_agent_a_session_and_its_job_is_keyed_by_it(rotating):
    helper = helper_agent(rotating)
    jobs = read_jobs(rotating, helper)
    rotating.expect_rows(agent_number(rotating, helper.id) == 2, bool(helper.session), [job.tool_key for job in jobs] == [helper.session])


def test_a_send_to_the_ended_agent_opens_a_job_on_the_same_agent_under_a_new_session(rotating):
    helper = helper_agent(rotating)
    command = " ".join(job_launch(rotating)["command"])
    current = helper_agent(rotating)
    rotating.expect_rows(current.id == helper.id, current.session != helper.session, helper.session not in command, current.session in command,
                         "--resume" not in command, len(read_jobs(rotating, helper)) == 2, detail=command)


def test_the_new_occupant_starts_from_the_profile_body_and_the_job_and_never_as_a_resume(rotating):
    brief = job_launch(rotating)["command"][2]
    number = agent_number(rotating, helper_agent(rotating).id)
    places = [brief.find(part) for part in (f"You are helper {number}.", ROTATING_BODY, JOB, REPORT_STEP_TEXT)]
    rotating.expect_rows(places[0] == 0, places == sorted(places), -1 not in places, detail=brief)


def test_the_new_occupant_is_told_its_memories_and_reads_one_the_first_occupant_wrote(rotating):
    helper = Actor(helper_agent(rotating).id, ActorType.AGENT)
    rotating.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=helper)
    job_launch(rotating)
    reply = rotating.hook(helper_agent(rotating).session, HookSamples.session_start())
    rotating.expect_rows(START_MEMORIES.nudge(count=1).text in reply.lines, detail=str(reply.lines))
    rotating.expect_text("memory list", MEMORY_TEXT, actor=helper)


def test_a_profile_changed_to_codex_while_the_agent_idles_gives_a_codex_occupant_of_the_same_agent(rotating):
    helper = helper_agent(rotating)
    rotating.expect_success(SAVE_ROTATING.replace("--program claude", "--program codex"), actor=rotating.user)
    launch = job_launch(rotating)
    current = helper_agent(rotating)
    rotating.expect_rows(launch["command"][0] == "codex", current.id == helper.id, current.program == "codex", current.retired_at is None,
                         agent_number(rotating, current.id) == agent_number(rotating, helper.id), detail=str(launch["command"][:2]))


def test_the_new_job_counts_only_the_cost_of_its_own_occupant(rotating):
    job_launch(rotating)
    jobs = read_jobs(rotating, helper_agent(rotating))
    rotating.expect_rows(jobs[1].cost_baseline == 0, jobs[1].tool_key == helper_agent(rotating).session, detail=str(jobs[1]))


def test_agent_show_names_the_current_occupant_and_the_job_list_names_each_jobs_program(rotating):
    rotating.expect_success(SAVE_ROTATING.replace("--program claude", "--program codex"), actor=rotating.user)
    job_launch(rotating)
    current = helper_agent(rotating)
    rotating.expect_text(f"agent show {agent_number(rotating, current.id)} --environment main", "program: codex", f"session: {current.session}", actor=rotating.user)
    rotating.expect_rows([row["program"] for row in job_rows(rotating)] == ["claude", "codex"], detail=str(job_rows(rotating)))


def test_a_person_who_sends_the_job_by_hand_gets_the_same_new_occupant(rotating):
    helper = helper_agent(rotating)
    command = " ".join(job_launch(rotating, actor=rotating.user)["command"])
    rotating.expect_rows(helper_agent(rotating).session != helper.session, "--resume" not in command, detail=command)


def program_outage(story, program: str) -> None:
    ends_at = (story.clock.timestamp().value + timedelta(minutes=30)).isoformat()
    story.expect_success(f'provider-outage make {program} "rate limit" --ends-at {ends_at}', actor=story.agent)


def test_when_claude_is_not_installed_the_next_occupant_runs_on_codex_under_the_same_agent(rotating, monkeypatch):
    helper = helper_agent(rotating)
    monkeypatch.setattr(shutil, "which", lambda name: None if name == "claude" else name)
    launch = job_launch(rotating)
    current = helper_agent(rotating)
    rotating.expect_rows(launch["command"][0] == "codex", current.id == helper.id, current.program == "codex", bool(current.program_model), detail=str(launch["command"][:2]))
    rotating.expect_rows(job_rows(rotating)[-1]["program"] == "codex", detail=str(job_rows(rotating)))


def test_a_profile_with_no_program_follows_the_program_split_at_each_launch(helper_split_story, helper_viewer):
    story = helper_split_story
    story.expect_success(SAVE_ROTATING.replace(" --program claude", ""), actor=story.user)
    set_split(story, "claude 100,codex 0", viewer=helper_viewer)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.run(START_ROTATING, actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.run_listeners()
    set_split(story, "claude 0,codex 100", viewer=helper_viewer)
    story.expect_rows(helper_agent(story).program == "claude", job_launch(story)["command"][0] == "codex", helper_agent(story).program == "codex")


def test_the_program_of_the_last_occupant_being_out_does_not_block_the_launch(rotating):
    program_outage(rotating, "claude")
    launch = job_launch(rotating)
    rotating.expect_rows(launch["command"][0] == "codex", helper_agent(rotating).program == "codex", detail=str(launch["command"][:2]))


def test_when_no_program_can_start_the_send_is_refused_and_nothing_changes(rotating):
    helper = helper_agent(rotating)
    program_outage(rotating, "claude")
    program_outage(rotating, "codex")
    start = rotating.run('helper start rotating --brief "Read src/tax.py" --fresh "A second view" --environment main', actor=rotating.agent)
    job_refusal = rotating.run(f'helper send {agent_number(rotating, helper.id)} "{JOB}"', actor=rotating.agent)
    rotating.expect_rows(start.code != 0, job_refusal.code != 0, job_refusal.output_text.partition(":")[0] == start.output_text.partition(":")[0], detail=f"{start.output_text} / {job_refusal.output_text}")
    rotating.expect_rows(helper_agent(rotating).session == helper.session, len(read_jobs(rotating, helper)) == 1)


def test_a_launch_that_cannot_start_ends_the_job_with_a_report_and_the_next_send_tries_a_new_occupant(rotating):
    helper = helper_agent(rotating)
    rotating.expect_success(f'helper send {agent_number(rotating, helper.id)} "{JOB}"', actor=rotating.agent)
    rotating.run_listeners()
    failed_session = helper_agent(rotating).session
    jobs = read_jobs(rotating, helper)
    rotating.expect_rows(len(jobs) == 2, jobs[1].ended_at is not None, "could not start" in jobs[1].returned, agent_number(rotating, helper.id) == 2, detail=str(jobs[-1]))
    rotating.expect_text(f"agent-line list --agent {rotating.agent.id}", "could not start")
    job_launch(rotating)
    rotating.expect_rows(helper_agent(rotating).session not in (helper.session, failed_session), len(read_jobs(rotating, helper)) == 3)
