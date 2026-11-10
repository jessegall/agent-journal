from core.testing.story_fixture import StoryFixture

from engine.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.modules.chat.support.mark_samples import mark_count, marks_text, expect_mark_count, expect_marks_text
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder

QUESTION_LINE = 'question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --environment main'


def with_question(story) -> None:
    story.expect_success(QUESTION_LINE, actor=story.agent)
    story.run_listeners()


def test_asking_shows_a_process_mark_with_the_question(new_story):
    story = new_story(fixture=AgentQuestion)
    expect_mark_count(story, 1)
    story.expect_success("chat-mark show 1", "text: Question 1: Which database?", "state: shown", f"session_agent_id: {story.agent.id}")


def test_the_process_mark_is_updated_in_place_while_the_question_waits(new_story):
    story = new_story(fixture=AgentQuestion)
    story.expect_success('question edit 1 --text "Which database engine?"', actor=story.agent)
    story.run_listeners()
    expect_mark_count(story, 1)
    story.expect_success("chat-mark show 1", "text: Question 1: Which database engine?", "state: shown")


def test_an_answer_ends_the_card_mark_in_place_and_adds_a_mark_on_the_side_of_the_user_who_answered(new_story):
    story = new_story(fixture=PersonQuestion)
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.run_listeners()
    story.expect_text("chat-mark show 1", "type: questions.question", "variant: user", "state: ended")
    expect_mark_count(story, 2)
    story.expect_text("chat-mark show 2", "type: questions.answer", "variant: user", "text: Question 1 answered")


def test_an_answer_by_the_agent_adds_a_mark_on_the_agents_side(new_story):
    story = new_story(fixture=PersonQuestion)
    story.run("question answer 1 --answer sqlite", actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark show 1", "variant: agent")
    story.expect_text("chat-mark show 2", "variant: agent")


def test_a_close_ends_the_one_mark_in_place_and_says_it_is_closed(new_story):
    story = new_story(fixture=AgentQuestion)
    story.expect_success("question close 1")
    story.run_listeners()
    story.expect_success("chat-mark show 1", "state: ended")
    expect_mark_count(story, 1)
    expect_marks_text(story, "Question 1 closed without an answer")


def test_the_question_mark_is_declared_as_a_process_in_its_family(new_story):
    story = new_story(fixture=BuilderStarted)
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "questions.question")
    expect_family_mark(mark, "questions.questions")
    expect_process_mark(mark)


class AgentQuestion(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        with_question(story)


class PersonQuestion(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        with_question(story)


def expect_family_mark(mark, expected) -> None:
    actual = mark.family
    assert actual == expected, actual


def expect_process_mark(mark) -> None:
    actual = mark.process
    assert actual, actual
