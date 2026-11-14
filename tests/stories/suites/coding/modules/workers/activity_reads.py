from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta
from unittest.mock import patch
import pytest

from engine.database.database import Database
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from engine.module.performance_tools import PerformanceTools
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.commands.title_output.title_output import TitleOutput
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.output_reading import OutputReading
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.support.story_checks import expect_value
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import worker_session, repository_environment
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT


BATCH_READS = 2


@pytest.fixture
def four_tasks(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    story.run(f"setting set {WORKER_RUN_LIMIT} 4 --environment main")
    for number in range(2, 5):
        story.run(f'task make "Job {number}" --brief "Finish job {number}" --environment main', actor=story.agent)
    return story


@pytest.fixture
def four_workers(four_tasks):
    story = four_tasks
    for number in range(1, 5):
        story.expect_success(f"worker dispatch --test-command python=pytest --fresh 'A new worker' --model sonnet {number}", actor=story.agent)
    return story


def test_a_later_tick_reads_fresh_activity_after_a_worker_acts(four_workers):
    story = four_workers
    workers = list(story.story_rows(Agent, parent_id=story.agent.id, role="worker"))
    story.advance(timedelta(minutes=14))
    story.tick("s-1")
    story.hook(worker_session(story, workers[0]), HookSamples.prompt("Continue the job"))
    story.advance(timedelta(minutes=1))
    with patch.object(Database, "rows", autospec=True, side_effect=Database.rows) as reads:
        story.tick("s-1")
    activity_reads = [call for call in reads.call_args_list if "FROM agent_activities" in call.args[1].sql]
    expect_value(len(activity_reads), 2)
    story.expect_rows(any("parent_id" in call.args[1].sql for call in activity_reads),
                      any("id IN" in call.args[1].sql for call in activity_reads))
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, workers[0].id)} used no tool")
    for worker in workers[1:]:
        story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} used no tool")


def test_a_worker_dispatch_reads_its_whole_task_batch_once_per_transaction(four_tasks):
    story = four_tasks
    with patch.object(Database, "rows", autospec=True, side_effect=Database.rows) as reads:
        story.expect_success("worker dispatch --test-command python=pytest --fresh 'A new worker' --model sonnet 1 2 3 4", actor=story.agent)
    batch_reads = [call for call in reads.call_args_list if "FROM tasks WHERE id IN (?, ?, ?, ?)" in call.args[1].sql and "FROM assignments" not in call.args[1].sql]
    expect_value(len(batch_reads), BATCH_READS)






