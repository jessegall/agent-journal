import re

from core.base.driver.hook_event_name import HookEventName
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.queries.message_query import MessageQuery

JOURNAL_LINE = "[journal] "
USER_ACTION_PREFIXES = ("[journal] new message", "[journal] question:", "[journal] the user")
MESSAGE_COUNT_TEXT = " new messages"
SHORT_CHARACTERS = 240
REPEATED_WORD_FRACTION = 0.6
WORDS = re.compile(r"[^\W_]+", re.UNICODE)
REFERENCES = re.compile(r"\b([a-z][a-z0-9_-]*)\s*(?::\s*|\s+)(\d+)\b", re.IGNORECASE)
NUMBERS = re.compile(r"\b\d+\b")


class AgentTextFilter:
    """Filter agent text already represented in the chat or addressed to the journal."""

    def __init__(self, hook_calls: HookCallQuery, messages: MessageQuery) -> None:
        self.hook_calls, self.messages = hook_calls, messages

    def has_recent_reply(self, agent_id: int, created_at: Timestamp) -> bool:
        prompt = self.hook_calls.latest_prompt(agent_id, created_at)
        if prompt is None:
            return False
        reply = self.messages.latest_reply(agent_id, prompt.creation_timestamp(), created_at)
        return reply is not None and not self.messages.has_person_message_past(reply.id)

    def is_held_after_reply(self, agent_id: int, text: str, created_at: Timestamp) -> bool:
        if "?" in text or not self.has_recent_reply(agent_id, created_at):
            return False
        prompt = self.hook_calls.latest_prompt(agent_id, created_at)
        if prompt is None:
            return False
        replies = self.messages.replies_between(agent_id, prompt.creation_timestamp(), created_at)
        reply_text = " ".join(reply.text for reply in replies).lower()
        text = text.lower()
        words = [word for word in WORDS.findall(text) if len(word) >= 3 or word.isdecimal()]
        if not words or not set(NUMBERS.findall(text)).issubset(NUMBERS.findall(reply_text)):
            return False
        refs = {(kind.rstrip("s"), number) for kind, number in REFERENCES.findall(text)}
        reply_refs = {(kind.rstrip("s"), number) for kind, number in REFERENCES.findall(reply_text)}
        if not refs.issubset(reply_refs):
            return False
        reply_words = set(WORDS.findall(reply_text))
        return sum(word in reply_words for word in words) / len(words) >= REPEATED_WORD_FRACTION

    def is_acknowledgement(self, agent_id: int, text: str, created_at: Timestamp) -> bool:
        prompt = self.hook_calls.latest_prompt(agent_id, created_at)
        if prompt is None or len(text) > SHORT_CHARACTERS or "?" in text or not prompt.summary.startswith(JOURNAL_LINE) or self.is_user_action(prompt.summary):
            return False
        file_call = self.hook_calls.latest_write_call(agent_id)
        return file_call is None or file_call.id < prompt.id

    def is_user_action(self, prompt_text: str) -> bool:
        return prompt_text.startswith(USER_ACTION_PREFIXES) or MESSAGE_COUNT_TEXT in prompt_text

    def is_displayed(self, agent_id: int, text: str, cutoff_at: Timestamp) -> bool:
        return self.hook_calls.has_call_after(agent_id, HookEventName.MESSAGE_DISPLAY, HookCall.summarize(text), cutoff_at) or self.messages.has_text_after(agent_id, text, cutoff_at)
