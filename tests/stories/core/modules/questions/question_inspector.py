from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.modules.questions.models.question import Question
from tests.stories.core.support.fixtures import MainEnvironment


def declaration_of(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry.declaration for entry in registry.inspectors if entry.declaration.model is Question)


def test_an_open_question_offers_to_write_an_answer_and_to_leave_it(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    actions = {action.name: action for action in declaration.actions}
    assert [(action.label, tuple(action.condition.values)) for action in actions.values()] == [("Write the answer", ("open",)), ("Leave the question without an answer", ("open",))]
    assert actions["questions.leave"].confirm
    assert actions["questions.write-answer"].runs == "question answer {row_id} --answer={answer}"
    assert actions["questions.leave"].runs == "question close {row_id}"


def test_an_answered_question_offers_no_action(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    assert all(tuple(action.condition.values) == ("open",) for action in declaration.actions)
    buttons = {entry.declaration.name: entry.declaration for entry in registry.buttons}
    assert tuple(buttons["questions.write-answer"].slots) == ("row.question",)


def test_the_question_inspector_declares_its_options_component(new_story):
    registry, declaration = declaration_of(new_story(fixture=MainEnvironment))
    assert [component.window for component in declaration.components] == ["questions.question-options"]
    window = next(window for window in registry.windows if window.name == "questions.question-options")
    assert (window.place, tuple(window.runs)) == ("section", ("question answer",))
