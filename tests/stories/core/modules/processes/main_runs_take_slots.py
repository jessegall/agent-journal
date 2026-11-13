from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.run_queue import queued, expect_slot, expect_waits, waits
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents


def story_with_main_runs(new_story, main_runs: int = 1):
    story = install_runner(new_story(fixture=QueueAgents))
    runs = [start_process(story, f"make main {number}", category=CommandCategory.TEST_RUN) for number in range(main_runs)]
    return story, runs


def test_a_main_agents_run_starts_at_once_while_a_worker_run_waits_for_a_place(new_story):
    story, _ = story_with_main_runs(new_story, main_runs=2)
    worker_run = queued(story, "make one")
    main_run = start_process(story, "make main 2", category=CommandCategory.TEST_RUN)
    story.expect_rows(waits(story, worker_run), not waits(story, main_run), detail="the main agent's run waited behind a worker's")


def test_a_main_agents_run_that_ends_gives_its_place_back_to_the_queue(new_story):
    story, runs = story_with_main_runs(new_story, main_runs=2)
    first = queued(story, "make one")
    expect_waits(story, first)
    end_run(story, runs[0], "ok\n")
    expect_slot(story, first)
