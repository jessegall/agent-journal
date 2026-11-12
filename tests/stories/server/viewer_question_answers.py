import pytest

from core.modules.drivers.models.agent_line import AgentLine
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.questions.marks import PersonQuestion
from tests.stories.server.support.server_client import server_story

ANSWER = {"window": "viewer.shell", "environment": "main", "line": ["question", "answer", "1", "--answer", "sqlite"]}
ANSWERED = "question:1 is answered"


@pytest.fixture
def question_server(new_story):
    with server_story(new_story(fixture=PersonQuestion)) as server:
        yield server


def test_an_answer_given_in_the_viewer_reaches_the_working_agent_that_asked_once(question_server):
    server = question_server
    story = server.story
    story.hook("s-1", HookSamples.session_start())
    server.viewer_line_value(server.expect_viewer_login(server.viewer_key("Ada")), ANSWER)
    story.run_listeners()
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), ANSWERED)
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), ANSWERED)


def test_an_answer_given_in_the_viewer_wakes_the_stopped_agent_that_asked(question_server):
    server = question_server
    story = server.story
    story.hook("s-1", HookSamples.session_start())
    story.tick("s-1")
    server.viewer_line_value(server.expect_viewer_login(server.viewer_key("Ada")), ANSWER)
    story.run_listeners()
    story.tick("s-1")
    lines = [line for line in story.story_rows(AgentLine) if ANSWERED in line.text]
    story.expect_rows(len(lines) == 1, all(line.wakes_agent for line in lines), detail=str(lines))
