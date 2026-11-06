from core.base.driver.hook_event_name import HookEventName
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.messages.queries.message_query import MessageQuery

JOURNAL_LINE = "[journal] "
USER_ACTION_PREFIXES = ("[journal] new message", "[journal] question:", "[journal] the user")
MESSAGE_COUNT_TEXT = " new messages"
SHORT_CHARACTERS = 240


class AgentTextFilter:
    """Which finished texts of the main agent stay out of the chat: a text that follows a reply by command in its
    turn is held, as it may be a closing line, and few words with no write that only answer a journal line; a line
    that says the user acted, by a message or a question, is answered as the user is."""

    def __init__(self, hook_calls: HookCallQuery, messages: MessageQuery) -> None:
        self.hook_calls, self.messages = hook_calls, messages

    def follows_reply(self, agent_id: int, written_at: Timestamp) -> bool:
        prompt = self.hook_calls.prompt_before(agent_id, written_at)
        if prompt is None:
            return False
        reply = self.messages.latest_reply(agent_id, prompt.creation_timestamp(), written_at)
        return reply is not None and not self.messages.has_person_message_past(reply.id)

    def is_acknowledgement(self, agent_id: int, text: str, written_at: Timestamp) -> bool:
        prompt = self.hook_calls.prompt_before(agent_id, written_at)
        if prompt is None or len(text) > SHORT_CHARACTERS or "?" in text or not prompt.summary.startswith(JOURNAL_LINE) or self.is_user_action(prompt.summary):
            return False
        file_call = self.hook_calls.latest_write_call(agent_id)
        return file_call is None or file_call.id < prompt.id

    def is_user_action(self, prompt_text: str) -> bool:
        return prompt_text.startswith(USER_ACTION_PREFIXES) or MESSAGE_COUNT_TEXT in prompt_text

    def is_displayed(self, agent_id: int, text: str, since: Timestamp) -> bool:
        return self.hook_calls.has_call_since(agent_id, HookEventName.MESSAGE_DISPLAY, HookCall.summary_of(text), since) or self.messages.has_text_since(agent_id, text, since)
