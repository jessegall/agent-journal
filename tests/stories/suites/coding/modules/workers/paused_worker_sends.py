import pytest

from core.base.query.queries import Queries
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
    story.expect_success(f"agent pause {story.worker.id}", actor=story.agent)
    return story


def main_agent_lines(story) -> str:
    return "\n".join(line.text for line in story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id).oldest().all_rows())


def test_a_send_to_a_paused_running_worker_says_it_is_paused_and_names_the_resume_not_that_it_takes_the_job(paused_worker):
    story = paused_worker
    story.expect_text(f'worker send --wait {story.worker.id} "Add the tax"', f"worker {story.worker.id} is paused", f"journal agent resume {story.worker.id}", actor=story.agent)
    story.expect_no_text(f'worker send --wait {story.worker.id} "Add the tax"', "takes the job", actor=story.agent)


def test_an_unblocked_task_of_a_paused_worker_tells_its_main_agent_the_worker_is_paused_and_queues_no_job(paused_worker):
    story = paused_worker
    task = story.new_row_id('task make "Later work" --environment main', actor=story.agent)
    story.expect_success(f'task block {task} --reason "Waits on the design"', actor=story.agent)
    story.expect_success(f"worker send --wait {story.worker.id} --task {task}", actor=story.agent)
    story.expect_success(f"task unblock {task}", actor=story.agent)
    lines = main_agent_lines(story)
    story.expect_rows(f"worker:{story.worker.id} is paused" in lines, f"journal agent resume {story.worker.id}" in lines, "has the job" not in lines, detail=lines)
    story.expect_rows(story.container.get(Queries).query(WorkerOperation).count() == 0)


def test_the_status_of_a_paused_worker_names_the_pause_and_the_resume(paused_worker):
    story = paused_worker
    story.expect_text(f"worker status {story.worker.id}", f"Paused: it takes no job until journal agent resume {story.worker.id}", actor=story.agent)
