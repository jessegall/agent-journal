from datetime import timedelta

from core.modules.agents.support.terminal_typing import TerminalTyping
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.messages.delivery import KeptTyping, StoppedMessagingTurn, post_message
from tests.stories.engine.driver.support.samples import SAMPLES

SILENT_IN_TURN = timedelta(minutes=10)


def test_a_message_for_an_agent_in_a_turn_is_never_typed_however_silent_it_is_but_rides_on_its_next_tool_call(new_story):
    story = new_story(SAMPLES, fixture=StoppedMessagingTurn)
    typing = KeptTyping()
    story.container.bind(TerminalTyping, typing)
    story.hook("s-1", HookSamples.prompt("go on"))
    story.advance(SILENT_IN_TURN)
    post_message(story, "Are you there")
    story.run_listeners()
    story.tick("s-1")
    story.run_listeners()
    story.expect_rows(typing.typed == [])
    story.expect_hook_allowed("s-1", HookSamples.edit("cart.py"), "new message 2")
