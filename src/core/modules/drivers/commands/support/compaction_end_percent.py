from engine.command.context import Context
from engine.driver.hook_event import HookEvent
from engine.driver.hook_event_name import HookEventName
from engine.row.metadata import Metadata
from engine.module.driver_entries import DRIVERS_MODULE
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.settings.bindings.support.context_share import ContextShare

COMPACTION_PENDING = "compaction_to_settle"


class CompactionEndPercent:
    """The session start hook of a compaction runs before the program rewrites its status file, so the percent
    stored there is still the one from before the compaction. The next hook of the session, a tick
    included, reads the percent again and replaces it once it is lower. The agent's row carries a mark from
    the compaction until it is settled, so every other hook reads no hook call for this."""

    def __init__(self, hook_calls: HookCallQuery, share: ContextShare, repository: Repository) -> None:
        self.hook_calls, self.share, self.repository = hook_calls, share, repository

    def finish_compaction(self, event: HookEvent, agent: Agent, context: Context) -> None:
        if event.is_compaction_start:
            self.mark(agent, True, context)
            return
        if event.event == HookEventName.COMPACT or not agent.metadata.module_part(DRIVERS_MODULE).get(COMPACTION_PENDING):
            return
        start = self.hook_calls.latest_turn_call(agent.id)
        if start is None or not start.is_compaction_start or start.context_percent is None:
            self.mark(agent, False, context)
            return
        percent = self.share.percent(event.program, event.session)
        if percent is None or percent >= start.context_percent:
            return
        self.mark(agent, False, context)
        self.repository.save_metadata(start, start.metadata_with_context_percent(percent), context)

    def mark(self, agent: Agent, pending: bool, context: Context) -> None:
        part = {**agent.metadata.module_part(DRIVERS_MODULE), COMPACTION_PENDING: pending}
        self.repository.save_metadata(agent, Metadata({**agent.metadata.values, DRIVERS_MODULE: part}), context)
