from datetime import timedelta
from pathlib import Path

from core.base.agent_role import AgentRole
from core.base.command.command import Command
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.base.provider.provider import Provider
from core.base.provider.providers import Providers
from core.base.provider.transcript_entry import TranscriptEntry
from core.base.provider.transcript_entries import TranscriptEntries
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.record_missing_prompt.record_missing_prompt import RecordMissingPrompt
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.environments.models.environment import Environment
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt import RecordTypedPrompt
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.commands.edit_message_text.edit_message_text import EditMessageText
from core.modules.messages.support.agent_text_filter import AgentTextFilter

HOOK_DELAY = timedelta(seconds=15)
HOOK_LOOKBACK = timedelta(seconds=60)
MAX_ENTRY_AGE = timedelta(hours=1)


class TranscriptMessageRule(DriverRule):
    """Record transcript messages and prompts whose hooks were missed."""

    name = "messages.transcript-catch-up"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True
    is_notice = True

    def __init__(self, queries: Queries, providers: Providers, transcripts: TranscriptEntries, hook_calls: HookCallQuery, texts: AgentTextFilter) -> None:
        self.queries, self.providers, self.transcripts, self.hook_calls, self.texts = queries, providers, transcripts, hook_calls, texts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        provider = self.providers.provider(hook.event.program)
        path = self.session_file(hook, provider)
        rows = self.transcripts.read_ready(provider, path, Timestamp(hook.timestamp.value - HOOK_DELAY)) if path is not None else []
        if not rows:
            return RuleAnswer.allowed()
        earliest_at = max(Timestamp(hook.timestamp.value - MAX_ENTRY_AGE), self.queries.query(Agent).find(hook.agent_id).creation_timestamp())
        return RuleAnswer.allowed().running(*(command for row in rows if row.created_at >= earliest_at for command in self.commands(hook, row)))

    def session_file(self, hook: AgentHook, provider: Provider) -> Path | None:
        if hook.event.event is not HookEventName.TICK:
            return provider.transcript_path(hook.event)
        return provider.transcript(Path(self.queries.query(Environment).find(hook.environment_id).folder), hook.event.session)

    def commands(self, hook: AgentHook, row: TranscriptEntry) -> list[Command[object]]:
        cutoff_at = Timestamp(row.created_at.value - HOOK_LOOKBACK)
        if row.is_prompt:
            has_hook = self.hook_calls.has_call_after(hook.agent_id, HookEventName.PROMPT, HookCall.summarize(row.text), cutoff_at)
            return [] if has_hook else [RecordMissingPrompt(row.text), RecordTypedPrompt(row.text.strip())]
        text = row.text.strip()
        if self.texts.is_displayed(hook.agent_id, text, cutoff_at):
            return []
        message = next((message for message in self.texts.messages.recent_agent_messages(hook.agent_id, cutoff_at) if text.endswith("\n" + message.text)), None)
        if message is not None and self.hook_calls.has_call_after(hook.agent_id, HookEventName.MESSAGE_DISPLAY, HookCall.summarize(message.text), cutoff_at):
            return [EditMessageText(message.id, text)]
        if self.is_filtered(hook, text, row.created_at):
            return []
        return [SendMessage(text)]

    def is_filtered(self, hook: AgentHook, text: str, created_at: Timestamp) -> bool:
        is_closing = self.texts.is_closing(hook, created_at)
        if is_closing and self.texts.is_reaction_turn(hook.agent_id, created_at):
            return True
        if self.texts.is_acknowledgement(hook.agent_id, text, created_at):
            return True
        if is_closing or not self.texts.is_single_line(text):
            return self.texts.is_held_after_reply(hook.agent_id, text, created_at)
        return self.texts.is_duplicate_reply(hook.agent_id, text, created_at)
