import json

from engine.database.database import Database
from tests.stories.core.modules.questions.fixtures import AnsweredQuestion, OpenQuestion


def test_the_list_shows_the_open_questions_with_their_choices(new_story):
    story = new_story(fixture=OpenQuestion)
    story.expect_success("question list", "1  Which database?  [sqlite / postgres]")


def test_an_answered_question_leaves_the_list(new_story):
    story = new_story(fixture=AnsweredQuestion)
    story.expect_success("question list", "no open questions")


def test_all_lists_an_answered_question_too(new_story):
    story = new_story(fixture=AnsweredQuestion)
    story.expect_success("question list --all", "1  Which database?  [sqlite / postgres]")


def test_a_question_saved_before_the_limits_still_reads(new_story):
    story = new_story(fixture=AnsweredQuestion)
    story.container.get(Database).connection.execute("UPDATE questions SET options = ?", [json.dumps(["x" * 127])])
    story.expect_success("question list --all", f"1  Which database?  [{'x' * 127}]")


def test_show_says_an_open_question_is_not_answered_yet(new_story):
    story = new_story(fixture=OpenQuestion)
    story.expect_success("question show 1", "question 1: Which database?", "choices: sqlite / postgres", "answer: not answered yet")


def test_show_gives_the_answer_and_says_to_act_on_it(new_story):
    story = new_story(fixture=AnsweredQuestion)
    story.expect_success("question show 1", "answer: sqlite", "act on the answer")
