from core.base.file_access import FileAccess
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.base.log_level import LogLevel
from core.base.log_source import LogSource
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.system_log_writer import SystemLogWriter
from core.modules.agents.models.agent import Agent
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.drivers.commands.record_bypass_line.record_bypass_line import RecordBypassLine
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant
from core.modules.drivers.models.hook_call import HookCall
from core.base.change.changed import Changed

MODULE_NAME = "journal.core.drivers"


class BypassLogListener(CommitListener[Changed[HookCall]]):
    """Reports hooks that passed while the journal did not answer."""

    name = "drivers.bypass-log"

    def __init__(self, home: JournalHome, queries: Queries, bus: Bus, actors: ModuleActors, system_log: SystemLogWriter) -> None:
        self.home, self.queries, self.bus, self.actors, self.system_log = home, queries, bus, actors, system_log

    def handle(self, event: Changed[HookCall], logged: LoggedEvent) -> None:
        log = self.home.bypass_log
        if not log.is_file():
            return
        agent = self.queries.query(Agent).find(event.row.session_agent_id)
        if agent.role != AgentRole.MAIN:
            return
        claimed = log.with_suffix(".taken")
        log.replace(claimed)
        lines = [line for line in FileAccess.shared().read(claimed, errors="replace").splitlines() if line.strip()]
        claimed.unlink()
        if not lines:
            return
        self.system_log.write(LogLevel.WARNING, "\n".join(lines), LogSource.BYPASS)
        count = len(lines)
        actor = self.actors.actor(MODULE_NAME)
        text = f"{count} hook{'s' if count != 1 else ''} went through unchecked while the journal did not answer"
        key = f"bypass:{logged.id}"
        self.bus.run(ShowMark(BypassMarkType.BYPASS, BypassMarkVariant.UNCHECKED, key, text, agent_id=agent.id, outcome=MarkOutcome.FAILED, ended=True),
                     actor, cause_id=logged.id)
        self.bus.run(RecordBypassLine(agent.id, count), actor, cause_id=logged.id)
