from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted

ASK = 'question ask "Which database?" --options sqlite postgres --environment main'


def asked(story) -> None:
    story.expect_success(ASK, actor=story.agent)
    story.run_listeners()


def test_asking_shows_a_process_mark_with_the_question(new_story):
    story = new_story(fixture=BuilderStarted)
    asked(story)
    assert mark_count(story) == 1, marks_text(story)
    story.expect_success("chat-mark show 1", "text: Question 1: Which database?", "state: shown", f"agent_id: {story.agent.id}")


def test_the_process_mark_is_updated_in_place_while_the_question_waits(new_story):
    story = new_story(fixture=BuilderStarted)
    asked(story)
    story.expect_success('question edit 1 --text "Which database engine?"', actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == 1, marks_text(story)
    story.expect_success("chat-mark show 1", "text: Question 1: Which database engine?", "state: shown")


def test_an_answer_ends_the_process_mark_and_shows_an_answer_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    asked(story)
    story.expect_success("question answer 1 --answer sqlite")
    story.run_listeners()
    story.expect_success("chat-mark show 1", "state: ended")
    assert mark_count(story) == 2 and "Question 1 answered: sqlite" in marks_text(story), marks_text(story)


def test_a_close_ends_the_process_mark_and_shows_a_close_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    asked(story)
    story.expect_success("question close 1")
    story.run_listeners()
    story.expect_success("chat-mark show 1", "state: ended")
    assert mark_count(story) == 2 and "Question 1 closed without an answer" in marks_text(story), marks_text(story)


def test_a_failed_ask_shows_no_mark(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('question ask "Which way?" --options "I will fix it" --environment main', "name who acts", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == 0
