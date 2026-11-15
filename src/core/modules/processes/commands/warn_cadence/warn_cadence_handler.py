from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.message_sender import MessageSender
from engine.query.queries import Queries
from core.modules.processes.commands.warn_cadence.warn_cadence import WarnCadence
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.cadence.cadence_messages import CadenceMessages

CADENCE_SOURCE = "processes.cadence"


class WarnCadenceHandler(Handler[WarnCadence, Process]):
    """Tells the agent of a running run how one of its parts prints; only the stuck warning wakes it."""

    command = WarnCadence

    def __init__(self, queries: Queries, message_sender: MessageSender) -> None:
        self.queries, self.message_sender = queries, message_sender

    def handle(self, command: WarnCadence, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if process.state not in RUNNING_STATES:
            return process
        part = self.queries.query(ProcessPart).filter(process_id=process.id, position=command.part_position).first()
        if part is None:
            return process
        notice = CadenceMessages.notice(command.notice_type, process, part, command.seconds, command.limit)
        self.message_sender.send(process.session_agent_id, notice.declaration, CADENCE_SOURCE, context, **notice.fields)
        return process
