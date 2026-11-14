from datetime import datetime, timezone
from types import SimpleNamespace

from core.modules.drivers.commands.record_missing_prompt.record_missing_prompt import RecordMissingPrompt
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt import RecordTypedPrompt
from core.modules.messages.rules.transcript_message_rule import TranscriptMessageRule
from engine.driver.seconds import Seconds
from engine.provider.transcript_entry import TranscriptEntry
from engine.time.timestamp import Timestamp

NOW = Timestamp(datetime(2026, 11, 15, 9, tzinfo=timezone.utc))
# the user row Claude Code leaves for a wake hook's line (report 1427, P2)
WAKE_PROMPT = ("<task-notification>\n<summary>Stop hook feedback</summary>\n</task-notification>\n<system-reminder>\n"
               'Stop hook blocking error from command "Stop": [journal] new message 12: read it with journal message show 12\n\n</system-reminder>')


class NoPromptHook:
    def has_call_after(self, agent_id, hook, summary, cutoff_at) -> bool:
        return False


class LookbackSettings:
    def seconds(self, key: str) -> Seconds:
        return Seconds(60)


def commands(text: str) -> list[type]:
    rule = TranscriptMessageRule(None, None, None, NoPromptHook(), None, LookbackSettings(), None)  # type: ignore[arg-type]
    hook = SimpleNamespace(agent_id=3)
    return [type(command) for command in rule.commands(hook, TranscriptEntry(True, text, NOW))]  # type: ignore[arg-type]


def test_a_wake_line_row_is_not_recorded_as_a_missing_prompt():
    assert commands(WAKE_PROMPT) == []


def test_a_person_prompt_row_still_is():
    assert commands("please look at the cart page") == [RecordMissingPrompt, RecordTypedPrompt]
