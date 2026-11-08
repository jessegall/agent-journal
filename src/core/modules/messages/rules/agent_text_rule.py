from datetime import timedelta

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.provider.providers import Providers
from core.base.provider.transcript_entries import TranscriptEntries
from core.base.timestamp import Timestamp
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.support.agent_text_filter import AgentTextFilter
from core.modules.messages.support.message_nudges import ONE_LINE_CLOSING, REPEATED_CLOSING
from core.modules.messages.support.repeated_messages import RepeatedMessages


class AgentTextRule(DriverRule):
    """Each finished text block the agent writes in a turn becomes a chat message of the agent, unless the
    filter keeps it out; a text held for following a reply is shown by ToolMessageRule once a tool comes."""

    name = "messages.agent-text"
    hook = HookEventName.MESSAGE_DISPLAY
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, texts: AgentTextFilter, providers: Providers, transcripts: TranscriptEntries, repeats: RepeatedMessages) -> None:
        self.texts, self.providers, self.transcripts, self.repeats = texts, providers, transcripts, repeats

    def answer(self, hook: AgentHook) -> RuleAnswer:
        text = self.complete_text(hook)
        if not text or self.texts.is_reaction_turn(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        after_reply = self.texts.is_after_reply(hook.agent_id, text, hook.timestamp)
        if (after_reply and self.texts.repeats_reply(hook.agent_id, text, hook.timestamp)) or self.texts.is_acknowledgement(hook.agent_id, text, hook.timestamp):
            return RuleAnswer.allowed()
        if after_reply and self.texts.is_single_line(text):
            return RuleAnswer.with_nudges(ONE_LINE_CLOSING.nudge())
        repeated =self.repeats.repeated(hook.agent_id, text)
        if repeated is not None:
            return RuleAnswer.with_nudges(REPEATED_CLOSING.nudge(message=repeated.id))
        return RuleAnswer.allowed().running(SendMessage(text))

    def complete_text(self, hook: AgentHook) -> str:
        text = hook.event.displayed_text
        provider = self.providers.provider(hook.event.program)
        path = provider.transcript_path(hook.event)
        if path is None or not text:
            return text
        cutoff_at = Timestamp(hook.timestamp.value - timedelta(seconds=60))
        rows = self.transcripts.recent(provider, path, cutoff_at)
        return next((row.text.strip() for row in rows[-1:] if not row.is_prompt and row.text.strip().endswith("\n" + text)), text)
