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
from core.base.provider.written_row import WrittenRow
from core.base.provider.written_rows import WrittenRows
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.record_lost_prompt.record_lost_prompt import RecordLostPrompt
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.environments.models.environment import Environment
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt import RecordTypedPrompt
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.support.agent_text_filter import AgentTextFilter

HOOK_ON_ITS_WAY = timedelta(seconds=15)
HOOK_BEFORE_ROW = timedelta(seconds=60)
LONGEST_LOOK_BACK = timedelta(hours=1)


class TranscriptCatchUpRule(DriverRule):
    """What the main agent wrote or a person typed reaches the journal even when its own hook did not: at a later
    hook or tick, a text in the session file with no display hook or message of its own, unless the filter would
    have kept it out, becomes a message, and a typed prompt with no prompt hook gets its hook call and its message. A row waits
    until its own hook had time to come, and nothing from before the agent started or over an hour old is read."""

    name = "messages.transcript-catch-up"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True
    is_notice = True

    def __init__(self, queries: Queries, providers: Providers, written: WrittenRows, hook_calls: HookCallQuery, texts: AgentTextFilter) -> None:
        self.queries, self.providers, self.written, self.hook_calls, self.texts = queries, providers, written, hook_calls, texts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        provider = self.providers.provider(hook.event.program)
        path = self.session_file(hook, provider)
        rows = self.written.settled(provider, path, Timestamp(hook.timestamp.value - HOOK_ON_ITS_WAY)) if path is not None else []
        if not rows:
            return RuleAnswer.allowed()
        oldest = max(Timestamp(hook.timestamp.value - LONGEST_LOOK_BACK), self.queries.query(Agent).find(hook.agent_id).creation_timestamp())
        return RuleAnswer.allowed().running(*(command for row in rows if row.written_at >= oldest for command in self.commands(hook, row)))

    def session_file(self, hook: AgentHook, provider: Provider) -> Path | None:
        if hook.event.event is not HookEventName.TICK:
            return provider.transcript_path(hook.event)
        return provider.transcript(Path(self.queries.query(Environment).find(hook.environment_id).folder), hook.event.session)

    def commands(self, hook: AgentHook, row: WrittenRow) -> list[Command[object]]:
        since = Timestamp(row.written_at.value - HOOK_BEFORE_ROW)
        if row.is_prompt:
            has_hook = self.hook_calls.has_call_since(hook.agent_id, HookEventName.PROMPT, HookCall.summary_of(row.text), since)
            return [] if has_hook else [RecordLostPrompt(row.text), RecordTypedPrompt(row.text.strip())]
        text = row.text.strip()
        if self.texts.is_displayed(hook.agent_id, text, since) or self.is_kept_out(hook, text, row.written_at):
            return []
        return [SendMessage(text)]

    def is_kept_out(self, hook: AgentHook, text: str, written_at: Timestamp) -> bool:
        if self.texts.is_acknowledgement(hook.agent_id, text, written_at):
            return True
        return self.texts.follows_reply(hook.agent_id, written_at) and hook.event.tool is None and not self.hook_calls.has_tool_hook_after(hook.agent_id, written_at)
