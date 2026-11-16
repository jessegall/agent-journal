from core.modules.agents.support.terminal_typing import TerminalTyping
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.messages.delivery import KeptTyping, MessagingTurn, post_message
from tests.stories.engine.driver.support.samples import SAMPLES

SESSION = "s-1"
SHELL_TASK = {"id": "task-001", "type": "shell", "status": "running", "description": "tail logs", "command": "tail -f app.log"}


def lines_entered_after_stop(new_story, stop):
    story = new_story(SAMPLES, fixture=MessagingTurn)
    typing = KeptTyping()
    story.replace(TerminalTyping, typing)
    story.hook(SESSION, stop)
    post_message(story, "Are you there")
    story.run_listeners()
    return story, typing


def test_a_stop_with_background_work_in_flight_is_not_idle_so_a_message_waits(new_story):
    story, typing = lines_entered_after_stop(new_story, HookSamples.stop().with_raw({"background_tasks": [SHELL_TASK], "session_crons": []}))
    story.expect_rows(typing.typed == [], detail=str(typing.typed))


def test_a_stop_with_nothing_in_flight_is_idle_so_a_message_is_typed(new_story):
    story, typing = lines_entered_after_stop(new_story, HookSamples.stop().with_raw({"background_tasks": [], "session_crons": []}))
    story.expect_rows(any("New message 1" in line for _, line in typing.typed), detail=str(typing.typed))
