from core.base.command.context import Context
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.metadata import Metadata
from core.base.module.driver_entries import DRIVERS_MODULE
from core.base.repository.repository import Repository
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.settings.support.context_share import ContextShare


class CompactionEndPercent:
    """The session start hook of a compaction runs before the program rewrites its status file, so the percent stored
    there is still the one from before the compaction. The next hook of the session, a tick included, reads the
    percent again and replaces it once it is lower."""

    def __init__(self, hook_calls: HookCallQuery, share: ContextShare, repository: Repository) -> None:
        self.hook_calls, self.share, self.repository = hook_calls, share, repository

    def settle(self, event: HookEvent, agent_id: int, context: Context) -> None:
        if event.is_compaction_start or event.event == HookEventName.COMPACT:
            return
        start = self.hook_calls.latest_turn_call(agent_id)
        if start is None or not start.is_compaction_start or start.context_percent is None:
            return
        percent = self.share.percent(event.program, event.session)
        if percent is None or percent >= start.context_percent:
            return
        part = {**start.metadata.module_part(DRIVERS_MODULE), "context_percent": percent}
        self.repository.save_metadata(start, Metadata({**start.metadata.values, DRIVERS_MODULE: part}), context)
