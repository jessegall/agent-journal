from core.modules.drivers.models.agent_line import AgentLine
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.questions.marks import PersonQuestion


def test_the_agent_hears_of_a_persons_answer_once_through_the_answered_question(new_story):
    story = new_story(fixture=PersonQuestion)
    story.hook("s-1", HookSamples.session_start())
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "question:1 is answered")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "question 1 is answered")


def test_a_stopped_agent_is_woken_by_a_persons_answer(new_story):
    story = new_story(fixture=PersonQuestion)
    story.hook("s-1", HookSamples.session_start())
    story.tick("s-1")
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.tick("s-1")
    lines = [line for line in story.story_rows(AgentLine) if "question:1 is answered" in line.text]
    story.expect_rows(len(lines) == 1, lines[0].wakes_agent, detail=str(lines))
