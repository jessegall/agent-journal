from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from tests.stories.core.modules.processes.run_queue import has_slot, queued, waits
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderWithUser

SETTING = "journal.core.processes.main-runs-take-slots"


def story_with_main_runs(new_story, setting: bool, main_runs: int = 1):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_success(f"setting set {SETTING} {'on' if setting else 'off'} --environment main", actor=story.user)
    runs = [start_process(story, f"make main {number}", category=CommandCategory.TEST_RUN) for number in range(main_runs)]
    return story, runs


def state_of(story, process: Process) -> Process:
    return story.container.get(Queries).query(Process).find(process.id)


def test_the_setting_is_off_by_default(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    story.expect_text(f"setting show {SETTING} --environment main", "value: False", "from: default", actor=story.user)


def test_with_the_setting_off_only_runs_with_a_spot_count_against_the_batch_size(new_story):
    story, _ = story_with_main_runs(new_story, setting=False)
    first, second = queued(story, "make one"), queued(story, "make two")
    assert has_slot(story, first) and has_slot(story, second)


def test_with_the_setting_on_the_main_agents_running_runs_count_against_the_batch_size(new_story):
    story, _ = story_with_main_runs(new_story, setting=True)
    first, second = queued(story, "make one"), queued(story, "make two")
    assert has_slot(story, first) and not has_slot(story, second) and waits(story, second)


def test_with_the_setting_on_the_main_agents_runs_still_never_wait_and_hold_no_spot(new_story):
    story, runs = story_with_main_runs(new_story, setting=True, main_runs=2)
    assert not any(waits(story, run) or has_slot(story, run) for run in runs)
    queued_run = queued(story, "make one")
    assert waits(story, queued_run)


def test_a_main_agents_run_that_ends_gives_its_place_back_to_the_queue(new_story):
    story, runs = story_with_main_runs(new_story, setting=True, main_runs=2)
    first = queued(story, "make one")
    assert waits(story, first)
    end_run(story, runs[0], "ok\n")
    assert has_slot(story, first)


def test_a_run_holding_a_spot_is_never_stopped_when_the_setting_goes_on_or_the_main_agent_fills_the_batch(new_story):
    story = install_runner(new_story(fixture=BuilderWithUser))
    holding = queued(story, "make one")
    story.expect_success(f"setting set {SETTING} on --environment main", actor=story.user)
    for number in range(3):
        start_process(story, f"make main {number}", category=CommandCategory.TEST_RUN)
    waiting = queued(story, "make two")
    assert has_slot(story, holding) and state_of(story, holding).state is ProcessState.RUNNING
    assert waits(story, waiting)
