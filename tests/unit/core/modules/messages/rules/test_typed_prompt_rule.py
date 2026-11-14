from types import SimpleNamespace

from core.modules.messages.rules.typed_prompt_rule import TypedPromptRule
from tests.unit.core.modules.messages.rules.test_transcript_message_rule import WAKE_PROMPT


def answered_commands(prompt: str) -> tuple[object, ...]:
    hook = SimpleNamespace(agent_id=3, event=SimpleNamespace(prompt=prompt))
    return tuple(TypedPromptRule(None).answer(hook).commands)  # type: ignore[arg-type]


def test_a_journal_prefixed_prompt_is_not_a_person_message():
    assert answered_commands("[journal] new message 12: read it with journal message show 12") == ()


def test_a_wake_notification_is_not_a_person_message():
    assert answered_commands(WAKE_PROMPT) == ()
