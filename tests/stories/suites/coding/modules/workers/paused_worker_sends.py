from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.query.queries import Queries
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

PAUSED_LINE = "is paused"


@pytest.fixture
def paused_worker(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    monkeypatch.setattr(QueuedProcessLaunch, "start", lambda *_args: None)
    story.worker = dispatched_worker(story)
    story.expect_success(f"agent pause {agent_number(story, story.worker.id)}", actor=story.agent)
    return story


def main_agent_lines(story) -> str:
    return "\n".join(line.text for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).oldest().all_rows())


def test_an_unblocked_task_of_a_paused_worker_tells_its_main_agent_the_worker_is_paused_and_queues_no_job(paused_worker):
    story = paused_worker
    task = story.new_row_id('task make "Later work" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --reason "Waits on the design"', actor=story.agent)
    story.expect_success(f"worker send --wait {agent_number(story, story.worker.id)} --task {task}", actor=story.agent)
    story.expect_success(f"task unblock {task}", actor=story.agent)
    lines = main_agent_lines(story)
    story.expect_rows(f"worker:{agent_number(story, story.worker.id)} is paused, so the job waits until it is resumed" in lines, "has the job" not in lines, detail=lines)
    story.expect_rows(len(story.story_rows(WorkerOperation)) == 0)
