from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.questions.models.question import Question
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def read_declaration(story):
    registry = Registry.read(story.container.get(Database))
    return registry, next(entry.declaration for entry in registry.inspectors if entry.declaration.model is Question)


def test_an_open_question_offers_to_write_an_answer_and_to_leave_it(new_story):
    registry, declaration = read_declaration(new_story(fixture=MainEnvironment))
    actions = {action.name: action for action in declaration.actions}
    expect_value([(action.label, tuple(action.condition.values)) for action in actions.values()], [("Write the answer", tuple(["open"])), ("Leave the question without an answer", tuple(["open"]))])
    expect_value(bool(actions["questions.leave"].confirm), True)
    expect_value(actions["questions.write-answer"].runs, "question answer {row_id} --answer={answer}")
    expect_value(actions["questions.leave"].runs, "question close {row_id}")


def test_an_answered_question_offers_no_action(new_story):
    registry, declaration = read_declaration(new_story(fixture=MainEnvironment))
    expect_value(bool(all(tuple(action.condition.values) == tuple(["open"]) for action in declaration.actions)), True)
    buttons = {entry.declaration.name: entry.declaration for entry in registry.buttons}
    expect_value(tuple(buttons["questions.write-answer"].slots), tuple(["row.question"]))


def test_the_question_inspector_declares_its_options_component(new_story):
    registry, declaration = read_declaration(new_story(fixture=MainEnvironment))
    expect_value([component.window for component in declaration.components], ["questions.question-options"])
    window = next(window for window in registry.windows if window.name == "questions.question-options")
    expect_value((window.place, tuple(window.runs)), ("section", tuple(["question answer"])))
