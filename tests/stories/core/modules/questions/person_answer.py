from core.modules.drivers.models.agent_line import AgentLine
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.questions.marks import PersonQuestion


def test_a_stopped_agent_is_woken_by_a_persons_answer(new_story):
    story = new_story(fixture=PersonQuestion)
    story.hook("s-1", HookSamples.session_start())
    story.tick("s-1")
    story.expect_success("question answer 1 --answer sqlite", actor=story.user)
    story.tick("s-1")
    lines = [line for line in story.story_rows(AgentLine) if "question:1 is answered" in line.text]
    story.expect_rows(len(lines) == 1, lines[0].wakes_agent, detail=str(lines))
