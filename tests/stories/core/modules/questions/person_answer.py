from tests.stories.core.modules.questions.marks import PersonQuestion
from core.modules.messages.models.message import Message
from tests.stories.core.modules.chat.support.mark_samples import expect_mark_count


def test_a_persons_answer_saves_no_message_and_shows_one_answered_mark_with_the_choice(new_story):
    story = new_story(fixture=PersonQuestion)
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.run_listeners()
    story.expect_rows(len(story.story_rows(Message)) == 0)
    story.expect_text("chat-mark show 2", "type: questions.answer", "variant: user", "text: Question 1 answered: sqlite")
    expect_mark_count(story, 2)
