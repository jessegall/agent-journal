from types import SimpleNamespace

from engine.enums.state_tier import StateTier
from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.time.timestamp import Timestamp
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.rules.unread_message_write_rule import UnreadMessageWriteRule
from core.modules.messages.states.messages_unread import MessagesUnread

CREATED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
HOOK = SimpleNamespace(agent_id=7)


def delivered_unread(messages: list[Message]) -> SimpleNamespace:
    waiting = SimpleNamespace(take=lambda size: messages[:size])
    return SimpleNamespace(delivered_unread=lambda agent_id: waiting)


def message() -> Message:
    return Message(id=5, version=1, created_at=CREATED, updated_at=CREATED, creator_id=1, type=MessageType.USER, text="Look at this", delivered_at=CREATED)


def test_the_state_is_asked_in_place_and_gates_the_unread_write_rule():
    assert (MessagesUnread.name, MessagesUnread.tier, MessagesUnread.rules) == ("messages.unread", StateTier.IN_PLACE, [UnreadMessageWriteRule])


def test_with_no_delivered_unread_message_the_state_is_closed_and_the_rule_answers_allowed_alone():
    none = delivered_unread([])
    assert MessagesUnread(none).open_rows(HOOK) == []
    assert UnreadMessageWriteRule(none).answer(HOOK) == RuleAnswer.allowed()


def test_with_a_delivered_unread_message_the_state_opens_with_the_oldest():
    assert MessagesUnread(delivered_unread([message()])).open_rows(HOOK) == [OpenRow("message", 5, CREATED)]
