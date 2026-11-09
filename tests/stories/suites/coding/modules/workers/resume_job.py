from datetime import timedelta

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.query.queries import Queries
from core.modules.agents.commands.record_agent_process.record_agent_process import RecordAgentProcess
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.agents.support.launch_answer import LaunchAnswer
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from core.modules.agents.support.agent_launcher import AgentLauncher
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment


@pytest.mark.parametrize("entered_during_hand", [True, False], ids=["hook-takes-line", "line-still-waits"])
def test_a_resumed_workers_job_is_entered_once(new_story, monkeypatch, entered_during_hand):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=1))
    job_ids = []
    entered = []
    original_run = Bus.run

    def record_enter(bus, command, *arguments, **options):
        if isinstance(command, EnterAgentLine) and command.row_id in job_ids:
            entered.append(command.row_id)
        return original_run(bus, command, *arguments, **options)

    def record_launch(launcher, agent, environment, command):
        job = story.container.get(Queries).query(AgentLine).filter(session_agent_id=agent.id, source=WORKER_JOB_SOURCE).newest().first()
        job_ids.append(job.id)
        story.container.get(Bus).run(RecordAgentProcess(agent.id, 123456789), Actor.core(), environment_id=environment.id)
        if entered_during_hand:
            story.container.get(Bus).run(EnterAgentLine(job.id), Actor(agent.id, ActorType.AGENT), environment_id=environment.id)
        return LaunchAnswer.STARTED

    monkeypatch.setattr(Bus, "run", record_enter)
    monkeypatch.setattr(AgentLauncher, "hand", record_launch)
    story.expect_success(f'worker send --wait {worker.id} "Continue the task"', actor=story.agent)
    story.run_listeners()

    story.expect_rows(len(job_ids) == 1, len(entered) == 1)
    story.expect_rows(story.row(AgentLine, job_ids[0]).state is AgentLineState.ENTERED)
    database = story.container.get(Database)
    story.expect_rows(not database.rows(Statement("SELECT * FROM journal_exceptions")))
    story.expect_rows(not database.rows(Statement("SELECT * FROM listener_skips WHERE listener = 'workers.ended-worker-job'")))
