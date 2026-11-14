from datetime import timedelta

from core.modules.agents.support.agent_resume import AgentResume
from tests.stories.core.modules.helpers.helper_jobs import JOB, START, helper_agent, resumable_session
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.gone_workers import missing_program, running_worker, start_launcher, worker_story

__all__ = ["missing_program", "running_worker", "worker_story"]

START_KEYS = {"agent_id", "session", "environment", "folder", "command", "variables"}


def test_555_a_worker_and_a_helper_that_ended_are_started_again_on_the_same_path_with_the_same_request(running_worker, monkeypatch):
    story, resumed_roles, resume = running_worker, list[str](), AgentResume.resume
    monkeypatch.setattr(AgentResume, "resume", lambda path, agent, command: resumed_roles.append(agent.role) or resume(path, agent, command))
    launcher = start_launcher(story, b"started 801\n", request_count=10)
    story.expect_success(f"agent end {story.worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=1))
    story.run(f'worker send --wait {agent_number(story, story.worker.id)} "Add the tax"', actor=story.agent)
    story.run_listeners()
    story.expect_success(START, actor=story.agent)
    story.run_listeners()
    helper = helper_agent(story)
    story.expect_success(f"agent end {helper.id}", actor=story.user)
    resumable_session(story, helper, monkeypatch)
    story.expect_success(f'helper send {agent_number(story, helper.id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    starts = {request["agent_id"]: set(request) for request in launcher.starts}
    story.expect_rows(sorted(set(resumed_roles)) == ["helper", "worker"], starts[story.worker.id] == START_KEYS, starts[helper.id] == START_KEYS,
                      detail=f"{resumed_roles} {starts}")
