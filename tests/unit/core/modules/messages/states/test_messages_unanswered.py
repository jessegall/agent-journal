from types import SimpleNamespace

from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.enums.state_tier import StateTier
from engine.time.timestamp import Timestamp
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.rules.unanswered_message_rule import UnansweredMessageRule
from core.modules.messages.states.messages_unanswered import MessagesUnanswered

CREATED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
HOOK = SimpleNamespace(agent_id=7, event=SimpleNamespace(tool=None))


class Untouched:
    """Stands for anything the rule would only reach after it found a message read in the session: any use fails."""


def session_reads(messages: list[Message]) -> SimpleNamespace:
    return SimpleNamespace(agent_start=lambda agent_id: CREATED.text, read_after=lambda agent_id, types, timestamp: SimpleNamespace(exists=lambda: bool(messages)),
                           first_read=lambda agent_id: messages[:1])


def message() -> Message:
    return Message(id=5, version=1, created_at=CREATED, updated_at=CREATED, creator_id=1, type=MessageType.USER, text="Look at this", read_at=CREATED)


def test_the_state_is_asked_in_place_and_gates_the_unanswered_rule():
    assert (MessagesUnanswered.name, MessagesUnanswered.tier, MessagesUnanswered.rules) == ("messages.unanswered-due", StateTier.IN_PLACE, [UnansweredMessageRule])


def test_with_nothing_read_in_the_session_the_state_is_closed_and_the_rule_answers_allowed_alone():
    none = session_reads([])
    assert MessagesUnanswered(none).open_rows(HOOK) == []
    assert UnansweredMessageRule(Untouched(), none, Untouched()).answer(HOOK) == RuleAnswer.allowed()


def test_a_message_read_in_the_session_opens_the_state_on_it():
    assert MessagesUnanswered(session_reads([message()])).open_rows(HOOK) == [OpenRow("message", 5, CREATED)]
