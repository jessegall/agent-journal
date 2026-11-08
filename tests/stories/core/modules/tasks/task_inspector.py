from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.tasks.models.task import Task
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def declaration_of(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry.declaration for entry in registry.inspectors if entry.declaration.model is Task)


def offered(declaration, state: str) -> list[str]:
    return [action.label for action in declaration.actions if state in action.condition.values]


def test_a_started_task_offers_complete_block_and_cancel(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    expect_value(offered(declaration, "started"), ["Complete the task", "Block the task", "Cancel the task"])
    expect_value(next(action for action in declaration.actions if action.label == "Complete the task").runs, "task close {row_id} --outcome={outcome}")


def test_a_blocked_task_offers_unblock(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    expect_value(offered(declaration, "blocked"), ["Unblock the task", "Cancel the task"])


def test_a_finished_task_offers_reopen(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    expect_value(bool(offered(declaration, "completed") == ["Reopen the task"] and offered(declaration, "cancelled") == ["Reopen the task"]), True)


def test_the_task_inspector_names_the_chain_and_log_components(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    expect_value([(component.window, component.tab) for component in declaration.components], [("tasks.task-details", ""), ("tasks.task-chain", ""), ("tasks.task-log", "Log")])
    expect_value((declaration.width.value, declaration.comments), ("medium", True))


def test_an_added_state_keeps_its_buttons(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    expect_value(offered(declaration, "legal-hold"), [])
