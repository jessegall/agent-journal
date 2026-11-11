from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.query.queries import Queries
from core.modules.processes.commands.warn_cadence.warn_cadence import WarnCadence
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_nudges import CadenceNudges

CADENCE_SOURCE = "processes.cadence"


class WarnCadenceHandler(Handler[WarnCadence, Process]):
    """Tells the agent of a running run, without waking it, how one of its parts prints."""

    command = WarnCadence

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, command: WarnCadence, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if process.state not in RUNNING_STATES:
            return process
        part = self.queries.query(ProcessPart).filter(process_id=process.id, position=command.part_position).first()
        if part is None:
            return process
        notice = CadenceNudges.notice(command.kind, process, part, command.seconds)
        self.nudger.send(process.session_agent_id, notice.declaration, CADENCE_SOURCE, context, **notice.fields)
        return process
