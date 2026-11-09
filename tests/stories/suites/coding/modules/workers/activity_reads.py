from datetime import timedelta
from unittest.mock import patch
import pytest

from core.base.database.database import Database
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.base.module.performance_tools import PerformanceTools
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.commands.read_new_output.read_new_output import ReadNewOutput
from core.modules.processes.commands.title_output.title_output import TitleOutput
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.commands.support.part_spec import PartSpec
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.output_reading import OutputReading
from core.testing.hook_samples import HookSamples
from tests.stories.support.story_checks import expect_value
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import worker_session, repository_environment
from tests.stories.suites.coding.modules.workers.report import MergerOffOrchestrator

BATCH_READS = 2


@pytest.fixture
def four_tasks(new_story):
    story = new_story(fixture=MergerOffOrchestrator)
    repository_environment(story)
    story.run("setting set journal.suites.coding.workers.worker-run-limit 4 --environment main")
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
    workers = list(story.container.get(Queries).query(Agent).filter(parent_id=story.agent.id, role="worker").oldest().all_rows())
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
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", f"worker:{workers[0].id} has used no tool")
    for worker in workers[1:]:
        story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} has used no tool")


@pytest.mark.real_git
def test_a_worker_dispatch_reads_its_whole_task_batch_once_per_transaction(four_tasks):
    story = four_tasks
    with patch.object(Database, "rows", autospec=True, side_effect=Database.rows) as reads:
        story.expect_success("worker dispatch --test-command python=pytest --fresh 'A new worker' --model sonnet 1 2 3 4", actor=story.agent)
    batch_reads = [call for call in reads.call_args_list if "FROM tasks WHERE id IN (?, ?, ?, ?)" in call.args[1].sql and "delegated_to" not in call.args[1].sql]
    expect_value(len(batch_reads), BATCH_READS)


def test_reading_running_worker_output_stays_within_the_tick_limit(four_workers):
    story = four_workers
    workers = story.container.get(Queries).query(Agent).filter(parent_id=story.agent.id, role="worker").oldest().all_rows()
    folder = story.container.get(OutputFolder)
    bus = story.container.get(Bus)
    for index, worker in enumerate(workers):
        for _ in range(3 if index == 0 else 2):
            command = StartProcess(worker.id, None, "make build", "/work/main", "sh", CommandCategory.BUILD, 30, [PartSpec("make build", "make")])
            process = bus.run(command, Actor(worker.id, ActorType.AGENT), environment_id=1)
            folder.write_output(process.id, 1, "building\n[ 40%]\n")
    tools = story.container.get(PerformanceTools)
    start = tools.begin()
    OutputReading().read(story.container)
    cost = tools.cost(start)
    story.expect_rows(cost is not None)
    story.expect_rows(cost.total < 50, cost.tables["outputs"] < 27, detail=f"{cost.line()}: {cost.statements}")


def test_five_workers_read_their_running_outputs_within_the_tick_limit(four_workers):
    story = four_workers
    story.run("setting set journal.suites.coding.workers.worker-run-limit 5 --environment main")
    task_id = story.new_row_id('task make "Job 5" --brief "Finish job 5" --environment main', actor=story.agent)
    story.expect_success(f"worker dispatch --test-command python=pytest --fresh 'A new worker' --model sonnet {task_id}", actor=story.agent)
    workers = story.container.get(Queries).query(Agent).filter(parent_id=story.agent.id, role="worker").oldest().all_rows()
    folder = story.container.get(OutputFolder)
    bus = story.container.get(Bus)
    for index, worker in enumerate(workers):
        for _ in range(3 if index < 2 else 2):
            command = StartProcess(worker.id, None, "make build", "/work/main", "sh", CommandCategory.BUILD, 30, [PartSpec("make build", "make")])
            process = bus.run(command, Actor(worker.id, ActorType.AGENT), environment_id=1)
            folder.write_output(process.id, 1, "building\n[ 40%]\n")
    tools = story.container.get(PerformanceTools)
    start = tools.begin()
    OutputReading().read(story.container)
    cost = tools.cost(start)
    story.expect_rows(cost is not None)
    story.expect_rows(cost.total < 50, detail=f"{cost.line()}: {cost.statements}")


def test_a_tick_reads_again_if_the_output_changes_after_its_batch_read(four_workers):
    story = four_workers
    worker = story.container.get(Queries).query(Agent).filter(parent_id=story.agent.id, role="worker").first()
    bus = story.container.get(Bus)
    process = bus.run(StartProcess(worker.id, None, "make build", "/work/main", "sh", CommandCategory.BUILD, 30, [PartSpec("make build", "make")]), Actor(worker.id, ActorType.AGENT), environment_id=1)
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, "building\n[ 40%]\n")
    run = bus.run
    changed = []

    def change_during_read(command, *args, **kwargs):
        if isinstance(command, ReadNewOutput) and command.prepared is not None and not changed:
            run(TitleOutput(process.id, "Building the project"), Actor(worker.id, ActorType.AGENT), environment_id=1)
            changed.append(True)
        return run(command, *args, **kwargs)

    with patch.object(bus, "run", side_effect=change_during_read):
        OutputReading().read(story.container)
    output = story.container.get(OutputQuery).process_output(process.id)
    story.expect_rows(changed, output.title == "Building the project", output.displayed_offset == folder.total_bytes(process.id))
