from tests.stories.core.modules.questions.fixtures import AnsweredQuestion, AskedQuestion


def test_an_open_question_is_answered(new_story):
    story = new_story(fixture=AskedQuestion)
    story.expect_success("question answer 1 --answer sqlite", "state: answered", "answer: sqlite")


def test_a_closed_question_keeps_an_empty_answer(new_story):
    story = new_story(fixture=AskedQuestion)
    story.expect_success("question close 1", "state: closed")
    story.expect_absent("question show 1", "answer:")


def test_a_second_answer_is_refused_with_its_way_out(new_story):
    story = new_story(fixture=AnsweredQuestion)
    story.expect_refusal("question answer 1 --answer postgres", "question 1 is answered, so it cannot answer: answered is final")


def test_an_answered_question_cannot_be_closed(new_story):
    story = new_story(fixture=AnsweredQuestion)
    story.expect_refusal("question close 1", "so it cannot close")
