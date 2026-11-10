from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.base.command.bus import Bus
from core.modules.agents.models.agent import Agent
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents


def queued(story, line: str, category: CommandCategory = CommandCategory.TEST_RUN) -> Process:
    queries = story.container.get(Queries)
    agent = queries.query(Agent).find(story.agent.id)
    workers = tuple(queries.query(Agent).filter(environment_id=agent.environment_id, role=CodingHelperRole.WORKER).oldest().all_rows())
    worker = Actor(workers[0].id, ActorType.AGENT)
    return story.container.get(Bus).run(StartProcess.single_part(worker.id, line, "/work", category, 30), story.agent, environment_id=agent.environment_id)


def has_slot(story, process: Process) -> bool:
    return story.container.get(OutputFolder).has_slot(process.id)


def waits(story, process: Process) -> bool:
    return story.container.get(Queries).query(Process).find(process.id).queued_at is not None


def test_runs_over_the_batch_size_wait_and_start_as_a_spot_frees(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    first, second, third = queued(story, "make one"), queued(story, "make two", CommandCategory.BUILD), queued(story, "make three")
    expect_slot_5(story, first, second, third, (True, True, False))
    expect_waits(story, third)
    end_run(story, first, "ok\n")
    expect_slot(story, third)
    expect_absent_waits(story, third)


def test_a_main_agents_run_neither_waits_nor_holds_a_spot(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    start_process(story, "make main", category=CommandCategory.TEST_RUN)
    first, second = queued(story, "make one"), queued(story, "make two")
    expect_slot(story, first)
    expect_slot(story, second)


def test_each_environment_queues_its_runs_by_its_own_batch_size(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    story.run("environment make web /work/web", actor=story.user)
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment web", actor=story.user)
    story.expect_success("setting set journal.suites.coding.workers.worker-run-most-tests 0 --environment web", actor=story.user)
    main_first, main_second, main_third = queued(story, "make one"), queued(story, "make two"), queued(story, "make three")
    story.agent = Actor(story.new_row_id("agent start s-9 claude worker --environment web"), ActorType.AGENT)
    web_first, web_second = queued(story, "make four"), queued(story, "make five")
    expect_slot_5(story, main_first, main_second, main_third, (True, True, False))
    expect_slot_4(story, web_first, web_second, (True, False))
    end_run(story, web_first, "ok\n")
    expect_slot(story, web_second)
    expect_absent_slot(story, main_third)


def expect_slot(story, process: Process) -> None:
    assert has_slot(story, process)


def expect_absent_slot(story, process: Process) -> None:
    assert not has_slot(story, process)


def expect_waits(story, process: Process) -> None:
    assert waits(story, process)


def expect_absent_waits(story, process: Process) -> None:
    assert not waits(story, process)


def expect_slot_4(story, web_first, web_second, expected) -> None:
    actual = (has_slot(story, web_first), has_slot(story, web_second))
    assert actual == expected, actual


def expect_slot_5(story, main_first, main_second, main_third, expected) -> None:
    actual = (has_slot(story, main_first), has_slot(story, main_second), has_slot(story, main_third))
    assert actual == expected, actual
