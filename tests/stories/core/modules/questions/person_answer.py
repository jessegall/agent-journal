from core.base.query.queries import Queries
from core.modules.messages.models.message import Message
from core.testing.hook_samples import HookSamples
from tests.stories.core.modules.chat.support.mark_samples import expect_mark_count
from tests.stories.core.modules.questions.marks import PersonQuestion


def test_a_persons_answer_saves_no_message_and_shows_one_answered_mark_with_the_choice(new_story):
    story = new_story(fixture=PersonQuestion)
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.run_listeners()
    story.expect_rows(story.container.get(Queries).query(Message).count() == 0)
    story.expect_text("chat-mark show 2", "type: questions.answer", "variant: user", "text: Question 1 answered: sqlite")
    expect_mark_count(story, 2)


def test_the_agent_hears_of_a_persons_answer_once_through_the_answered_question(new_story):
    story = new_story(fixture=PersonQuestion)
    story.hook("s-1", HookSamples.session_start())
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "question:1 is answered")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "question 1 is answered")
