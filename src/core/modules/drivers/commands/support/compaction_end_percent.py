from engine.command.context import Context
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.row.metadata import Metadata
from engine.module.driver_entries import DRIVERS_MODULE
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.enums.compaction_notice_type import CompactionNoticeType
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from core.modules.drivers.models.enums.context_change import ContextChange
from core.modules.drivers.support.compaction_notices import CompactionNotices
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.compaction_limit import CompactionLimit
from core.modules.drivers.support.context_compactions import ContextCompactions
from core.modules.drivers.support.current_context_window import COMPACTION_ENDED_AT, CurrentContextWindow
from core.modules.settings.bindings.support.context_share import ContextShare

COMPACTION_PENDING = "compaction_to_settle"


class CompactionEndPercent:
    """The session start hook of a compaction runs before the program rewrites its status file, so the percent
    stored there is still the one from before the compaction. The next hook of the session, a tick
    included, reads the percent again and replaces it once it is lower. The agent's row carries a mark from
    the compaction until it is settled, so every other hook reads no hook call for this, and the time its
    newest compaction ended, which CurrentContextWindow compares a reading with."""

    def __init__(self, hook_calls: HookCallQuery, share: ContextShare, repository: Repository, compactions: ContextCompactions, current_window: CurrentContextWindow, limit: CompactionLimit, notices: CompactionNotices) -> None:
        self.notices = notices
        self.hook_calls, self.share, self.repository, self.compactions, self.current_window, self.limit = hook_calls, share, repository, compactions, current_window, limit

    def finish_compaction(self, event: HookEvent, agent: Agent, context: Context) -> None:
        if event.is_compaction_start or event.is_clear_start:
            self.compactions.record_end(agent.id, ContextChange.CLEAR if event.is_clear_start else ContextChange.COMPACT, context)
            self.mark_ended(agent, context)
            return
        if event.event == HookEventName.COMPACT:
            self.compactions.record_start(agent.id, CompactionReason.TERMINAL_PERSON if event.is_manual_compaction else CompactionReason.AUTO, context)
            return
        if event.event in (HookEventName.SESSION_START, HookEventName.SESSION_END):
            self.compactions.abandon_open(agent.id, context)
        if not agent.metadata.module_part(DRIVERS_MODULE).get(COMPACTION_PENDING):
            return
        tokens = self.current_window.window(agent).total_input_tokens
        if tokens is not None:
            measured = self.compactions.record_tokens_after(agent.id, tokens, self.limit.tokens(), context)
            if measured is not None and measured.state is CompactionState.UNREDUCED:
                self.notices.report(measured, agent, CompactionNoticeType.UNREDUCED, context)
        start = self.hook_calls.latest_turn_call(agent.id)
        if start is None or not start.is_compaction_start:
            self.mark(agent, False, context)
            return
        if start.context_percent is None:
            if tokens is not None:
                self.mark(agent, False, context)
            return
        percent = self.share.percent(event.program, event.session)
        if percent is None or percent >= start.context_percent:
            return
        self.mark(agent, False, context)
        self.repository.save_metadata(start, start.metadata_with_context_percent(percent), context)

    def mark_ended(self, agent: Agent, context: Context) -> None:
        part = {**agent.metadata.module_part(DRIVERS_MODULE), COMPACTION_PENDING: True, COMPACTION_ENDED_AT: context.timestamp.text}
        self.repository.save_metadata(agent, Metadata({**agent.metadata.values, DRIVERS_MODULE: part}), context)

    def mark(self, agent: Agent, pending: bool, context: Context) -> None:
        part = {**agent.metadata.module_part(DRIVERS_MODULE), COMPACTION_PENDING: pending}
        self.repository.save_metadata(agent, Metadata({**agent.metadata.values, DRIVERS_MODULE: part}), context)
