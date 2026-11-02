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


def check_of(story, opened_at=None):
    clock_time = story.clock.timestamp()
    agent_id = story.agent.id
    event = HookEvent.parsed(HookSamples.session_start().with_fields(session="s-1", firing="check", fired_at_ms=0).body)
    hook = AgentHook(event=event, agent_id=agent_id, environment_id=1, role=AgentRole.MAIN, driver="builder", timestamp=clock_time)
    return BlockCheck(hook, opened_at or clock_time, story.container)


def test_the_task_conditions_follow_a_task(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    opened_at = story.clock.timestamp()
    assert not TaskStarted(1).is_true(check_of(story))
    assert not StartedTaskExists().is_true(check_of(story))
    story.run("task start 1", actor=story.agent)
    assert TaskStarted(1).is_true(check_of(story))
    assert StartedTaskExists().is_true(check_of(story))
    assert not TaskLogged(1).is_true(check_of(story, opened_at))
    story.advance(timedelta(seconds=1))
    story.run('task log 1 "half way"', actor=story.agent)
    assert TaskLogged(1).is_true(check_of(story, opened_at))
    assert not TaskClosed(1).is_true(check_of(story))
    story.run('task close 1 --outcome "done"', actor=story.agent)
    assert TaskClosed(1).is_true(check_of(story))


def test_the_question_conditions_follow_a_question(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('question ask "Which one?" --options "a" "b" --environment main', actor=story.agent)
    assert not QuestionAnswered(1).is_true(check_of(story))
    assert not QuestionsClosed().is_true(check_of(story))
    story.run('question answer 1 --answer "a"')
    assert QuestionAnswered(1).is_true(check_of(story))
    assert QuestionsClosed().is_true(check_of(story))


def test_a_check_condition_follows_its_last_run(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('check make "Suite" --command "true"')
    assert not CheckPassed(1).is_true(check_of(story))
    story.run("check run 1")
    assert CheckPassed(1).is_true(check_of(story))


def test_time_and_tool_use_conditions(new_story):
    story = new_story(fixture=BuilderStarted)
    later = Timestamp(story.clock.timestamp().value + timedelta(minutes=5))
    assert not TimeReached(later.text).is_true(check_of(story))
    story.advance(timedelta(minutes=6))
    assert TimeReached(later.text).is_true(check_of(story))
    assert not ToolUses(1).is_true(check_of(story))


def test_a_stored_condition_is_built_again_and_one_no_module_registers_counts_as_true(new_story):
    story = new_story(fixture=BuilderStarted)
    conditions = story.container.get(BlockConditions)
    assert isinstance(conditions.built(TaskClosed.name, "1"), TaskClosed)
    assert conditions.built("gone-with-its-plugin", "1").is_true(check_of(story))
