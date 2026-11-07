from suites.coding.support.available_work import AvailableWork
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask
from tests.stories.suites.coding.support.main_controls_fixture import in_environment
from tests.stories.support.story_checks import expect_value

AUTO = "journal.suites.coding.auto-mode"
DISPATCHES = "journal.suites.coding.workers.builder-dispatches-workers"
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
    expect_value((answer.own_task, answer.delegatable, answer.may_stop), (None, (1,), False))


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
