from datetime import timedelta

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_check import BlockCheck
from core.base.driver.conditions.time_reached import TimeReached
from core.base.driver.hook_event import HookEvent
from core.base.module.block_conditions import BlockConditions
from core.base.timestamp import Timestamp
from core.modules.drivers.support.block_conditions.tool_uses import ToolUses
from core.modules.questions.support.block_conditions.question_answered import QuestionAnswered
from core.modules.questions.support.block_conditions.questions_closed import QuestionsClosed
from core.modules.tasks.support.block_conditions.started_task_exists import StartedTaskExists
from core.modules.tasks.support.block_conditions.task_closed import TaskClosed
from core.modules.tasks.support.block_conditions.task_logged import TaskLogged
from core.modules.tasks.support.block_conditions.task_started import TaskStarted
from core.testing.hook_samples import HookSamples
from suites.coding.modules.checks.support.block_conditions.check_passed import CheckPassed
from tests.stories.core.support.coding_fixtures import BuilderStarted


def read_check(story, opened_at=None):
    clock_time = story.clock.timestamp()
    agent_id = story.agent.id
    event = HookEvent.parsed(HookSamples.session_start().with_fields(session="s-1", firing="check", fired_at_ms=0).body)
    hook = AgentHook(event=event, agent_id=agent_id, environment_id=1, role=AgentRole.MAIN, driver="builder", timestamp=clock_time)
    return BlockCheck(hook, opened_at or clock_time, story.container)


def test_the_task_conditions_follow_a_task(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    opened_at = story.clock.timestamp()
    expect_absent_true_task_started(1, story)
    expect_absent_true_started_task(story)
    story.run("task start 1", actor=story.agent)
    expect_true_task_started(1, story)
    expect_true_started_task(story)
    expect_absent_true_task_logged(1, story, opened_at)
    story.advance(timedelta(seconds=1))
    story.run('task log 1 "half way"', actor=story.agent)
    expect_true_task_logged(1, story, opened_at)
    expect_absent_true_task_closed(1, story)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    expect_true_task_closed(1, story)


def test_the_question_conditions_follow_a_question(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('question ask "Which one?" --context "A story asks this so its card and answer can be checked." --options "a" "b" --environment main', actor=story.agent)
    expect_absent_true_question_answered(1, story)
    expect_absent_true_questions_closed(story)
    story.run('question answer 1 --answer "a"')
    expect_true_question_answered(1, story)
    expect_true_questions_closed(story)


def test_a_check_condition_follows_its_last_run(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('check make "Suite" --command "true"')
    expect_absent_true_check_passed(1, story)
    story.run("check run 1")
    expect_true_check_passed(1, story)


def test_time_and_tool_use_conditions(new_story):
    story = new_story(fixture=BuilderStarted)
    later = Timestamp(story.clock.timestamp().value + timedelta(minutes=5))
    expect_absent_true_time_reached(later, story)
    story.advance(timedelta(minutes=6))
    expect_true_time_reached(later, story)
    expect_absent_true_tool_uses(1, story)


def test_a_stored_condition_is_built_again_and_one_no_module_registers_counts_as_true(new_story):
    story = new_story(fixture=BuilderStarted)
    conditions = story.container.get(BlockConditions)
    expect_isinstance(conditions, "1")
    expect_true_built_conditions(conditions, "gone-with-its-plugin", "1", story)


def expect_true_built_conditions(conditions, text, text_2, story) -> None:
    actual = conditions.built(text, text_2).is_true(read_check(story))
    assert actual, actual


def expect_isinstance(conditions, text) -> None:
    actual = isinstance(conditions.built(TaskClosed.name, text), TaskClosed)
    assert actual, actual


def expect_absent_true_tool_uses(number, story) -> None:
    actual = ToolUses(number).is_true(read_check(story))
    assert not actual, actual


def expect_true_time_reached(later, story) -> None:
    actual = TimeReached(later.text).is_true(read_check(story))
    assert actual, actual


def expect_absent_true_time_reached(later, story) -> None:
    actual = TimeReached(later.text).is_true(read_check(story))
    assert not actual, actual


def expect_true_check_passed(number, story) -> None:
    actual = CheckPassed(number).is_true(read_check(story))
    assert actual, actual


def expect_absent_true_check_passed(number, story) -> None:
    actual = CheckPassed(number).is_true(read_check(story))
    assert not actual, actual


def expect_true_questions_closed(story) -> None:
    actual = QuestionsClosed().is_true(read_check(story))
    assert actual, actual


def expect_true_question_answered(number, story) -> None:
    actual = QuestionAnswered(number).is_true(read_check(story))
    assert actual, actual


def expect_absent_true_questions_closed(story) -> None:
    actual = QuestionsClosed().is_true(read_check(story))
    assert not actual, actual


def expect_absent_true_question_answered(number, story) -> None:
    actual = QuestionAnswered(number).is_true(read_check(story))
    assert not actual, actual


def expect_true_task_closed(number, story) -> None:
    actual = TaskClosed(number).is_true(read_check(story))
    assert actual, actual


def expect_absent_true_task_closed(number, story) -> None:
    actual = TaskClosed(number).is_true(read_check(story))
    assert not actual, actual


def expect_true_task_logged(number, story, opened_at) -> None:
    actual = TaskLogged(number).is_true(read_check(story, opened_at))
    assert actual, actual


def expect_absent_true_task_logged(number, story, opened_at) -> None:
    actual = TaskLogged(number).is_true(read_check(story, opened_at))
    assert not actual, actual


def expect_true_started_task(story) -> None:
    actual = StartedTaskExists().is_true(read_check(story))
    assert actual, actual


def expect_true_task_started(number, story) -> None:
    actual = TaskStarted(number).is_true(read_check(story))
    assert actual, actual


def expect_absent_true_started_task(story) -> None:
    actual = StartedTaskExists().is_true(read_check(story))
    assert not actual, actual


def expect_absent_true_task_started(number, story) -> None:
    actual = TaskStarted(number).is_true(read_check(story))
    assert not actual, actual
