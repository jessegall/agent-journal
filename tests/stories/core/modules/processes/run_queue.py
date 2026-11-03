from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithUser


def queued(story, line: str, category: CommandCategory = CommandCategory.TEST_RUN) -> Process:
    return start_process(story, line, category=category, is_queued=True)


def has_slot(story, process: Process) -> bool:
    return story.container.get(OutputFolder).has_slot(process.id)


def waits(story, process: Process) -> bool:
    return story.container.get(Queries).query(Process).find(process.id).is_queued


def test_runs_over_the_batch_size_wait_and_start_as_a_spot_frees(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    first, second, third = queued(story, "make one"), queued(story, "make two", CommandCategory.BUILD), queued(story, "make three")
    assert (has_slot(story, first), has_slot(story, second), has_slot(story, third)) == (True, True, False)
    assert waits(story, third)
    end_run(story, first, "ok\n")
    assert has_slot(story, third) and not waits(story, third)


def test_the_batch_size_is_a_setting(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    first, second = queued(story, "make one"), queued(story, "make two")
    assert has_slot(story, first) and not has_slot(story, second)


def test_a_main_agents_run_neither_waits_nor_holds_a_spot(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    start_process(story, "make main", category=CommandCategory.TEST_RUN)
    first, second = queued(story, "make one"), queued(story, "make two")
    assert has_slot(story, first) and has_slot(story, second)


def test_each_environment_queues_its_runs_by_its_own_batch_size(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.run("environment make web /work/web", actor=story.user)
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment web", actor=story.user)
    main_first, main_second, main_third = queued(story, "make one"), queued(story, "make two"), queued(story, "make three")
    story.agent = Actor(story.new_row_id("agent start s-9 claude worker --environment web"), ActorType.AGENT)
    web_first, web_second = queued(story, "make four"), queued(story, "make five")
    assert (has_slot(story, main_first), has_slot(story, main_second), has_slot(story, main_third)) == (True, True, False)
    assert (has_slot(story, web_first), has_slot(story, web_second)) == (True, False)
    end_run(story, web_first, "ok\n")
    assert has_slot(story, web_second) and not has_slot(story, main_third)
