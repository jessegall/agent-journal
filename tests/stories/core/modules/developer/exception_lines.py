from datetime import timedelta

from engine.log.exception_sink import ExceptionSink
from core.modules.developer.support.developer_settings import TOOLS_SETTING
from tests.stories.core.support.fixtures import UserJoined
from core.modules.developer.support.developer_nudges import EXCEPTION_LINE
from engine.testing.expectations.expected_nudge import expected_nudge

LINES = "agent-line list --agent {agent}"


def failed_read(story, message):
    story.container.get(ExceptionSink).record("line agent cards", message, 1)
    story.run_listeners()


def test_an_error_in_the_chat_reaches_the_main_agent_once(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
    failed_read(story, "TypeError: an unexpected argument")
    failed_read(story, "TypeError: an unexpected argument")
    story.advance(timedelta(minutes=5))
    failed_read(story, "TypeError: an unexpected argument")
    lines = story.run(LINES.format(agent=story.agent.id)).output_text
    story.expect_rows(lines.count("journal-exception:1") == 1, "TypeError" not in lines)
    story.expect_text("journal-exception show 1", "TypeError: an unexpected argument")


def test_with_the_tools_off_no_line_is_sent(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting switch {TOOLS_SETTING} off --project", actor=story.user)
    failed_read(story, "TypeError: a second error")
    story.expect_no_text(LINES.format(agent=story.agent.id), expected_nudge(EXCEPTION_LINE))
