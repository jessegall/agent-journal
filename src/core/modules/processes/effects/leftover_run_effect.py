from collections.abc import Sequence

from engine.agent.agent_role_reader import AgentRoleReader
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from core.modules.processes.queries.process_query import ProcessQuery

LEFTOVER_RUNS_REASON = "every run the agent left running when it stopped is orphaned"


class LeftoverRunEffect(EventEffect):
    """Ends the runs the agent started in an old session unless the suite declares that its runs continue. A run the
    journal started for the agent is not the agent's to end."""

    key = "processes.leftover-runs"
    events = [HookEventName.SESSION_START]

    def __init__(self, processes: ProcessQuery, types: HelperTypeBook, roles: AgentRoleReader) -> None:
        self.processes, self.types, self.roles = processes, types, roles

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        if event is None or event.is_continuing or self.types.behaviours(self.roles.role(agent_id)).continues_runs:
            return []
        return [OrphanProcess(process.id) for process in self.processes.agent_started(agent_id).running().every_row(LEFTOVER_RUNS_REASON)]
