from tests.stories.core.modules.questions.fixtures import OpenQuestion


def test_an_open_question_docks_from_its_inspector(new_story):
    story = new_story(fixture=OpenQuestion)
    story.expect_success("dock add questions.question question 1 --environment main", "type: questions.question", actor=story.user)


def test_a_question_docks_once(new_story):
    story = new_story(fixture=OpenQuestion)
    story.run("dock add questions.question question 1 --environment main", actor=story.user)
    story.expect_refusal("dock add questions.question question 1 --environment main", "is docked already", actor=story.user)
