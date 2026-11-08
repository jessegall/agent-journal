from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from suites.coding.support.available_work import AvailableWork
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask
from tests.stories.suites.coding.support.main_controls_fixture import in_environment
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
DISPATCHES = "journal.suites.coding.workers.main-dispatches-workers"
WORKER_LIMIT = "journal.suites.coding.workers.worker-run-limit"


def available(story):
    with in_environment(story):
        return story.container.get(AvailableWork).answer(story.agent.id)


def test_s03_auto_on_hands_the_open_task_to_the_main_agent_and_it_may_not_stop(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    answer = available(story)
    expect_value((answer.own_task.id, answer.may_stop), (1, False))


def test_s04_auto_off_hands_nothing_to_the_main_agent_but_the_task_can_be_delegated(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success(f"setting set {AUTO} off --environment main")
    answer = available(story)
    expect_value((answer.own_task, answer.delegatable, answer.may_stop), (None, tuple([1]), False))


def test_s47_no_worker_permission_or_no_place_leaves_nothing_to_do_and_the_main_agent_may_stop(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success(f"setting set {AUTO} off --environment main")
    story.expect_success(f"setting set {DISPATCHES} off --environment main")
    expect_value(available(story).may_stop, True)
    story.expect_success(f"setting set {DISPATCHES} on --environment main")
    story.expect_success(f"setting set {WORKER_LIMIT} 0 --environment main")
    expect_value(available(story).may_stop, True)


def test_s48_a_task_the_main_agent_already_holds_is_not_handed_out_again(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success("task start 1", actor=story.agent)
    expect_value(available(story).own_task, None)


KEEP_GOING = "journal.suites.coding.continue-while-delegatable"


class MainWithKeepGoingOff(StoryFixture):
    parent = BuilderWithOpenTask

    def steps(self, story):
        story.expect_success("driver choose coding.main --environment main")
        story.expect_success(f"setting set {KEEP_GOING} off --environment main")
        story.expect_success(f"setting set {AUTO} off --environment main")


def main_story(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.expect_success("driver choose coding.main --environment main")
    return story


def test_s01_the_main_driver_hands_the_open_task_to_a_stopping_main_agent_when_auto_is_on(new_story):
    story = main_story(new_story)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is yours now")


def test_s02_the_main_driver_holds_a_stop_while_a_task_can_go_to_a_worker_and_keep_going_is_on(new_story):
    story = main_story(new_story)
    story.expect_success(f"setting set {AUTO} off --environment main")
    story.expect_success(f"setting set {KEEP_GOING} on --environment main")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait")


def test_s08_the_main_driver_holds_a_stop_once_for_a_free_worker_place_when_keep_going_is_off(new_story):
    story = new_story(fixture=MainWithKeepGoingOff)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "can go to a worker and a place is free")
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_the_free_place_notice_comes_back_when_another_task_can_go_to_a_worker(new_story):
    story = new_story(fixture=MainWithKeepGoingOff)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "can go to a worker and a place is free")
    story.expect_success('task make "Another task" --brief "A second task that a worker can take"', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "can go to a worker and a place is free")
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_s10_the_main_driver_lets_the_main_agent_stop_when_no_worker_can_start(new_story):
    story = main_story(new_story)
    story.expect_success(f"setting set {WORKER_LIMIT} 0 --environment main")
    story.expect_success(f"setting set {AUTO} off --environment main")
    story.expect_success(f"setting set {KEEP_GOING} on --environment main")
    story.expect_hook_allowed("s-1", HookSamples.stop())
