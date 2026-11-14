from dataclasses import fields
from types import SimpleNamespace

from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from core.modules.messages.states.unread_countdown import UnreadCountdown
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.support.message_nudges import UNREAD_COUNTDOWN, UNREAD_REFUSAL, UNREAD_TOOL_USES

HOOK = SimpleNamespace(agent_id=7)


def same_block(first, second) -> bool:
    plain = [field.name for field in fields(first) if field.name not in ("after", "condition")]
    return (all(getattr(first, name) == getattr(second, name) for name in plain) and first.after.spans == second.after.spans
            and (type(first.condition), first.condition.text) == (type(second.condition), second.condition.text))


def test_the_block_the_rule_starts_is_the_block_blocking_after_built_for_the_same_messages():
    started = UnreadCountdown.start(HOOK, MessagesRead([41, 42]), {"count": 2}, messages="41, 42")
    built = RuleAnswer.allowed().blocking_after(HOOK, UNREAD_REFUSAL.nudge(count=2), MessagesRead([41, 42]), Interval(ToolUseSpan(UNREAD_TOOL_USES)), UNREAD_COUNTDOWN.nudge("{left}", messages="41, 42")).commands[0]
    assert same_block(started, built)


def test_the_state_is_named_and_keyed_by_the_unread_refusal_and_gates_no_rule():
    assert (UnreadCountdown.name, UnreadCountdown.rules, UnreadCountdown(SimpleNamespace()).keys()) == ("messages.unread-countdown", [], [UNREAD_REFUSAL.key])
