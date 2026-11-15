from engine.testing.examples.hook_samples import HookSamples
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.messages.nudges.new_message_nudge import NewMessageNudge
from tests.stories.core.modules.messages.delivery import MessagingTurn
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.engine.driver.support.samples import SAMPLES


class KeptTyping(TerminalTyping):
    """Keeps what would be typed, so the test reaches no launcher."""

    def __init__(self) -> None:
        self.typed: list[tuple[int, str]] = []

    def send_line(self, agent_id: int, line: str) -> None:
        self.typed.append((agent_id, line))


def test_a_message_to_a_resting_main_agent_is_typed_by_the_wake_its_step_opens_in_the_messages_own_line(played):
    story = played(SAMPLES, fixture=MessagingTurn)
    typing = KeptTyping()
    story.replace(TerminalTyping, typing)
    agent = hook_agent(story, story.hook("s-1", HookSamples.stop()))
    story.run('message send "Use sqlite" --environment main', actor=story.user)
    story.run_listeners()
    story.run_tick_handler("agent step round")
    story.run_tick_handler("agent wake delivery")
    assert typing.typed == [(agent.id, f"[journal] {NewMessageNudge.declared().nudge(message=1).text}")]


def test_lines_a_stop_cannot_carry_wait_for_the_agents_next_event_instead_of_riding_on_the_stop(played):
    story = played(SAMPLES, fixture=MessagingTurn)
    story.run('message send "Use sqlite" --environment main', actor=story.user)
    reply = story.hook("s-1", HookSamples.stop())
    assert not any("New message" in line for line in reply.lines)
    later = story.hook("s-1", HookSamples.prompt("go on"))
    assert any("New message 1" in line for line in later.lines)
