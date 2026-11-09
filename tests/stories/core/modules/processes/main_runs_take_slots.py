from core.base.driver.command_category import CommandCategory
from tests.stories.core.modules.processes.run_queue import has_slot, queued, waits, expect_absent_slot, expect_slot, expect_waits
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents

SETTING = "journal.core.processes.main-runs-take-slots"


def story_with_main_runs(new_story, setting: bool, main_runs: int = 1):
    story = install_runner(new_story(fixture=QueueAgents))
    story.expect_success(f"setting set {SETTING} {'on' if setting else 'off'} --environment main", actor=story.user)
    runs = [start_process(story, f"make main {number}", category=CommandCategory.TEST_RUN) for number in range(main_runs)]
    return story, runs


def test_the_setting_is_off_by_default(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    story.expect_text(f"setting show {SETTING} --environment main", "value: False", "from: default", actor=story.user)


def test_a_main_agents_run_that_ends_gives_its_place_back_to_the_queue(new_story):
    story, runs = story_with_main_runs(new_story, setting=True, main_runs=2)
    first = queued(story, "make one")
    expect_waits(story, first)
    end_run(story, runs[0], "ok\n")
    expect_slot(story, first)
