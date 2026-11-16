from collections.abc import Sequence
from pathlib import Path

from engine.enums.agent_role import AgentRole
from engine.command.command import Command
from engine.enums.hook_event_name import HookEventName
from engine.provider.provider import Provider
from engine.provider.providers import Providers
from engine.provider.transcript_author import TranscriptAuthor
from engine.provider.transcript_entry import TranscriptEntry
from engine.provider.transcript_entries import TranscriptEntries
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.record_missing_prompt.record_missing_prompt import RecordMissingPrompt
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.environments.models.environment import Environment
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt import RecordTypedPrompt
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.commands.edit_message_text.edit_message_text import EditMessageText
from core.modules.messages.support.agent_text_filter import AgentTextFilter
from core.modules.messages.support.message_settings import TRANSCRIPT_LOOKBACK_SECONDS, TRANSCRIPT_OLDEST_MINUTES, TRANSCRIPT_WAIT_SECONDS
from core.modules.messages.support.turn_reply_targets import TurnReplyTargets
from engine.setting.setting_values import SettingValues
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.driver.hook_event import HookEvent
from engine.time.clock import Clock
from core.modules.drivers.support.minute_tick import MinuteTick


TRANSCRIPT_SYNC_KEY = "messages.transcript-catch-up"


class TranscriptSyncEffect(EventEffect):
    """Records the main agent's transcript messages and prompts whose hooks were missed, at every hook and at its
    minute step, where it reads the transcript of the tick that step replaces."""

    key = TRANSCRIPT_SYNC_KEY
    events = list(HookEventName)
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries, providers: Providers, transcripts: TranscriptEntries, hook_calls: HookCallQuery, texts: AgentTextFilter, settings: SettingValues,
                 targets: TurnReplyTargets, clock: Clock, minute_tick: MinuteTick) -> None:
        self.queries, self.providers, self.transcripts, self.hook_calls, self.texts, self.settings, self.targets = queries, providers, transcripts, hook_calls, texts, settings, targets
        self.clock, self.minute_tick = clock, minute_tick

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return self.commands_at(event if event is not None else self.minute_tick.event(agent_id), agent_id)

    def commands_at(self, event: HookEvent, agent_id: int) -> list[Command[object]]:
        provider = self.providers.provider(event.program)
        agent = self.queries.query(Agent).find(agent_id)
        path = self.session_file(event, agent.environment_id, provider)
        current_time = self.clock.timestamp()
        rows = self.transcripts.read_ready(provider, path, self.settings.seconds(TRANSCRIPT_WAIT_SECONDS).deducted(current_time)) if path is not None else []
        if not rows:
            return []
        earliest_at = max(self.settings.minutes(TRANSCRIPT_OLDEST_MINUTES).deducted(current_time), agent.creation_timestamp())
        return [command for row in rows if row.created_at >= earliest_at for command in self.row_commands(event, agent_id, row)]

    def session_file(self, event: HookEvent, environment_id: int, provider: Provider) -> Path | None:
        if event.event is not HookEventName.TICK:
            return provider.transcript_path(event)
        return provider.transcript(Path(self.queries.query(Environment).find(environment_id).folder), event.session)

    def row_commands(self, event: HookEvent, agent_id: int, row: TranscriptEntry) -> list[Command[object]]:
        cutoff_at = self.settings.seconds(TRANSCRIPT_LOOKBACK_SECONDS).deducted(row.created_at)
        # the wake hook's own notification is no prompt a person typed
        if row.is_prompt and TranscriptAuthor.is_wake_notification(row.text):
            return []
        if row.is_prompt:
            has_hook = self.hook_calls.has_call_after(agent_id, HookEventName.PROMPT, HookCall.summarize(row.text), cutoff_at)
            return [] if has_hook else [RecordMissingPrompt(row.text), RecordTypedPrompt(row.text.strip())]
        text = row.text.strip()
        if self.texts.is_displayed(agent_id, text, cutoff_at):
            return []
        message = next((message for message in self.texts.messages.recent_agent_messages(agent_id, cutoff_at) if text.endswith("\n" + message.text)), None)
        if message is not None and self.hook_calls.has_call_after(agent_id, HookEventName.MESSAGE_DISPLAY, HookCall.summarize(message.text), cutoff_at):
            return [EditMessageText(message.id, text)]
        if self.is_filtered(event, agent_id, text, row.created_at):
            return []
        return [SendMessage(text, self.targets.parent_id(agent_id, text, row.created_at), is_agent_text=True)]

    def is_filtered(self, event: HookEvent, agent_id: int, text: str, created_at: Timestamp) -> bool:
        is_closing = self.texts.is_closing(event, agent_id, created_at)
        if is_closing and self.texts.is_reaction_turn(agent_id, created_at):
            return True
        if self.texts.is_acknowledgement(agent_id, text, created_at):
            return True
        if is_closing or not self.texts.is_single_line(text):
            return self.texts.is_blocked_after_reply(agent_id, text, created_at)
        return self.texts.is_duplicate_reply(agent_id, text, created_at)
