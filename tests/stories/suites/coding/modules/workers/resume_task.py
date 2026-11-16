from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from core.modules.agents.support.agent_conversations import AgentConversations
from datetime import timedelta
from pathlib import Path
import json
import shlex

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.file.file_access import FileAccess
from engine.journal.journal_home import LAUNCHER_SOCKET
from engine.json.json_settings import JsonSettings
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.agents.testing.fake_launcher import FakeLauncher
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import checked_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository




def stopped_worker_with_entered_job(story) -> Actor:
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.advance(timedelta(seconds=1))
    bus = story.container.get(Bus)
    bus.run(RecordAgentNotice(worker.id, "An earlier task", WORKER_JOB_SOURCE), Actor.core(), environment_id=1)
    line = story.newest_row(AgentLine, session_agent_id=worker.id, source=WORKER_JOB_SOURCE)
    bus.run(EnterAgentLine(line.id), Actor.core(), environment_id=1)
    repository.checkout(ENVIRONMENT_BRANCH)
    return worker


def test_an_entered_line_without_a_process_does_not_block_a_new_task_start(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker = stopped_worker_with_entered_job(story)
    task_id = story.new_row_id('task make "Another task" --brief "Read the totals"', actor=story.agent)
    launcher = FakeLauncher.accepting(story.home.socket(LAUNCHER_SOCKET), answer=b"started 123456789\n")
    try:
        story.expect_success(f"worker send --wait {worker.id} --task {task_id}", actor=story.agent)
        story.run_listeners()
        story.expect_rows(not launcher.starts)
        request_merge(story, worker)
        story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
        story.run_listeners()
        story.expect_rows(len(launcher.starts) == 1)
        story.expect_rows(story.row(Agent, worker.id).ended_at is None)
        story.expect_rows(any(f"task overview {task_id}" in argument for argument in launcher.starts[0]["command"]))
    finally:
        launcher.server.close()
