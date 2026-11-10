from tests.stories.core.support.agent_labels import agent_number
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from suites.coding.modules.workers.support.available_work import AvailableWork
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from tests.stories.suites.coding.support.main_controls_fixture import scope_line
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
DISPATCHES = "journal.suites.coding.workers.main-dispatches-workers"
WORKER_LIMIT = "journal.suites.coding.workers.worker-run-limit"


def available(story):
    with scope_line(story):
        return story.container.get(AvailableWork).answer(story.agent.id)


def test_s03_auto_on_hands_the_open_task_to_the_main_agent_and_it_may_not_stop(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    answer = available(story)
    expect_value((answer.assigned_task.id, answer.may_stop), (1, False))


CONTINUE_SETTING = "journal.suites.coding.continue-while-delegatable"


class KeepGoingOffMain(StoryFixture):
    parent = OpenTaskBuilder

    def steps(self, story):
        story.expect_success("driver choose coding.main --environment main")
        story.expect_success(f"setting set {CONTINUE_SETTING} off --environment main")
        story.expect_success(f"setting set {AUTO} off --environment main")


def main_story(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success("driver choose coding.main --environment main")
    return story


def test_s01_the_main_driver_hands_the_open_task_to_a_stopping_main_agent_when_auto_is_on(new_story):
    story = main_story(new_story)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is yours now")


def test_s02_the_main_driver_holds_a_stop_while_a_task_can_go_to_a_worker_and_keep_going_is_on(new_story):
    story = main_story(new_story)
    story.expect_success(f"setting set {AUTO} off --environment main")
    story.expect_success(f"setting set {CONTINUE_SETTING} on --environment main")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "open tasks wait")


def test_s08_the_main_driver_holds_a_stop_once_for_a_free_worker_place_when_keep_going_is_off(new_story):
    story = new_story(fixture=KeepGoingOffMain)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "can go to a worker and a place is free")
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_the_free_place_notice_comes_back_when_another_task_can_go_to_a_worker(new_story):
    story = new_story(fixture=KeepGoingOffMain)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "can go to a worker and a place is free")
    story.expect_success('task make "Another task" --brief "A second task that a worker can take"', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "can go to a worker and a place is free")
    story.expect_hook_allowed("s-1", HookSamples.stop())


def test_s10_the_main_driver_lets_the_main_agent_stop_when_no_worker_can_start(new_story):
    story = main_story(new_story)
    story.expect_success(f"setting set {WORKER_LIMIT} 0 --environment main")
    story.expect_success(f"setting set {AUTO} off --environment main")
    story.expect_success(f"setting set {CONTINUE_SETTING} on --environment main")
    story.expect_hook_allowed("s-1", HookSamples.stop())


class UnfinishedTaskMain(StoryFixture):
    parent = OpenTaskBuilder

    def steps(self, story):
        story.expect_success(f"setting set {DISPATCHES} off --environment main")
        story.expect_success(f"setting set {AUTO} off --environment main")
        story.expect_success("driver choose coding.main --environment main")
        story.expect_success('plan make "Later work" --brief "A plan the person has not approved"', actor=story.agent)
        story.expect_success('phase make --plan 1 "First" --goal "The first step is done"', actor=story.agent)
        story.expect_success('task make "In the plan" --brief "A task of a plan that has not started" --phase 1', actor=story.agent)
        story.expect_success(f"task assign 2 --to {agent_number(story, story.agent.id)}", actor=story.agent)


def test_a_stop_with_an_unfinished_task_of_its_own_in_a_plan_not_started_is_held_naming_it(new_story):
    story = new_story(fixture=UnfinishedTaskMain)
    story.expect_hook_refusal("s-1", HookSamples.stop(), "tasks 2 are yours and unfinished")


def test_a_main_agent_that_waits_on_something_may_stop_with_an_unfinished_task(new_story):
    story = new_story(fixture=UnfinishedTaskMain)
    story.expect_success('wait stuck "the person decides the order"', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.stop())
