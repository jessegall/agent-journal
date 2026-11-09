import re

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.agent_hook import AgentHook
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery, TOOL_HOOKS
from core.modules.messages.queries.message_query import MessageQuery

JOURNAL_LINE = "[journal] "
USER_ACTION_PREFIXES = ("[journal] new message", "[journal] question:", "[journal] the user resumed")
REACTION_PREFIX = "[journal] the user reacted to message:"
OLDER_REACTION_PREFIX = "[journal] the user put "
MESSAGE_COUNT_TEXT = " new messages"
SHORT_CHARACTERS = 240
REPEATED_TOKEN_FRACTION = 0.6
TOKENS = re.compile(r"[^\W_]+", re.UNICODE)
REFERENCES = re.compile(r"\b([a-z][a-z0-9_-]*)\s*(?::\s*|\s+)(\d+)\b", re.IGNORECASE)
NUMBERS = re.compile(r"\b\d+\b")
FILES = re.compile(r"[\w./-]*\w\.[a-z]{1,5}\b|[\w.-]+/[\w./-]+", re.IGNORECASE)


class AgentTextFilter:
    """Filter agent text already represented in the chat or addressed to the journal."""

    def __init__(self, hook_calls: HookCallQuery, messages: MessageQuery) -> None:
        self.hook_calls, self.messages = hook_calls, messages

    def has_recent_reply(self, agent_id: int, created_at: Timestamp) -> bool:
        prompt = self.hook_calls.latest_prompt(agent_id, created_at)
        if prompt is None:
            return False
        reply = self.messages.latest_turn_message(agent_id, prompt.creation_timestamp(), created_at)
        return reply is not None and not self.messages.has_person_message_after(reply.id) and not self.hook_calls.refused_stop_exists(agent_id, reply.creation_timestamp(), created_at)

    def is_duplicate_reply(self, agent_id: int, text: str, created_at: Timestamp) -> bool:
        return self.is_after_reply(agent_id, text, created_at) and self.repeats_reply(agent_id, text, created_at)

    def is_after_reply(self, agent_id: int, text: str, created_at: Timestamp) -> bool:
        return "?" not in text and self.has_recent_reply(agent_id, created_at)

    def is_single_line(self, text: str) -> bool:
        return "\n" not in text.strip()

    def is_blocked_after_reply(self, agent_id: int, text: str, created_at: Timestamp) -> bool:
        return self.is_after_reply(agent_id, text, created_at) and (self.is_single_line(text) or self.repeats_reply(agent_id, text, created_at))

    def repeats_reply(self, agent_id: int, text: str, created_at: Timestamp) -> bool:
        prompt = self.hook_calls.latest_prompt(agent_id, created_at)
        if prompt is None:
            return False
        replies = self.messages.turn_messages(agent_id, prompt.creation_timestamp(), created_at)
        reply_text = " ".join(reply.text for reply in replies).lower()
        text = text.lower()
        tokens = [token for token in TOKENS.findall(text) if len(token) >= 3 or token.isdecimal()]
        if not tokens or not set(NUMBERS.findall(text)).issubset(NUMBERS.findall(reply_text)):
            return False
        refs = {(row_type.rstrip("s"), number) for row_type, number in REFERENCES.findall(text)}
        reply_refs = {(row_type.rstrip("s"), number) for row_type, number in REFERENCES.findall(reply_text)}
        if not refs.issubset(reply_refs):
            return False
        reply_tokens = set(TOKENS.findall(reply_text))
        if sum(token in reply_tokens for token in tokens) / len(tokens) >= REPEATED_TOKEN_FRACTION:
            return True
        return bool(refs) and set(FILES.findall(text)).issubset(FILES.findall(reply_text))

    def is_reaction_turn(self, agent_id: int, created_at: Timestamp) -> bool:
        prompt = self.hook_calls.latest_prompt(agent_id, created_at)
        return prompt is not None and self.is_reaction_prompt(prompt.summary)

    def is_closing(self, hook: AgentHook, created_at: Timestamp) -> bool:
        following = self.hook_calls.next_turn_event(hook.agent_id, created_at)
        return hook.event.tool is None if following is None else following.hook not in TOOL_HOOKS

    def is_acknowledgement(self, agent_id: int, text: str, created_at: Timestamp) -> bool:
        prompt = self.hook_calls.latest_prompt(agent_id, created_at)
        if prompt is None or len(text) > SHORT_CHARACTERS or "?" in text or not prompt.summary.startswith(JOURNAL_LINE) or self.is_user_action(prompt.summary) or self.is_reaction_prompt(prompt.summary):
            return False
        file_call = self.hook_calls.latest_file_edit_call(agent_id)
        return file_call is None or file_call.id < prompt.id

    def is_reaction_prompt(self, prompt_text: str) -> bool:
        return prompt_text.startswith(REACTION_PREFIX) or (prompt_text.startswith(OLDER_REACTION_PREFIX) and " on message:" in prompt_text)

    def is_user_action(self, prompt_text: str) -> bool:
        return prompt_text.startswith(USER_ACTION_PREFIXES) or MESSAGE_COUNT_TEXT in prompt_text

    def is_displayed(self, agent_id: int, text: str, cutoff_at: Timestamp) -> bool:
        return self.hook_calls.has_call_after(agent_id, HookEventName.MESSAGE_DISPLAY, HookCall.summarize(text), cutoff_at) or self.messages.has_text_after(agent_id, text, cutoff_at)

    def is_displayed_part(self, agent_id: int, text: str, cutoff_at: Timestamp) -> bool:
        return any(message.text.endswith("\n" + text) for message in self.messages.recent_agent_messages(agent_id, cutoff_at))
