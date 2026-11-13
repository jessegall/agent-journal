from core.modules.drivers.models.agent_line import AgentLine
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.questions.marks import PersonQuestion
from core.modules.messages.models.message import Message
from tests.stories.core.modules.chat.support.mark_samples import expect_mark_count
from core.modules.questions.support.question_nudges import QUESTION_ANSWERED


def test_a_stopped_agent_is_woken_by_a_persons_answer(new_story):
    story = new_story(fixture=PersonQuestion)
    story.hook("s-1", HookSamples.session_start())
    story.tick("s-1")
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.tick("s-1")
    lines = story.story_rows(AgentLine)
    answered = [line for line in lines if QUESTION_ANSWERED.nudge(question=1).text in line.text]
    story.expect_rows(len(answered) == 1, any(line.wakes_agent for line in lines), detail=str(lines))


def test_a_persons_answer_saves_no_message_and_shows_one_answered_mark_with_the_choice(new_story):
    story = new_story(fixture=PersonQuestion)
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.run_listeners()
    story.expect_rows(len(story.story_rows(Message)) == 0)
    story.expect_text("chat-mark show 2", "type: questions.answer", "variant: user", "text: Question 1 answered: sqlite")
    expect_mark_count(story, 2)
