from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.helpers.commands.send_program_fault.send_program_fault import SendProgramFault
from core.modules.helpers.agent_messages.helper_program_fault_message import HelperProgramFaultMessage


class SendProgramFaultHandler(Handler[SendProgramFault, None]):
    """Tells the main agent when a helper program exits with an error."""

    command = SendProgramFault

    def __init__(self, main_line: MainAgentLine) -> None:
        self.main_line = main_line

    def handle(self, command: SendProgramFault, context: Context) -> None:
        line = HelperProgramFaultMessage.declared().agent_message(agent=command.agent_id, code=command.exit_code)
        self.main_line.send(line.text, HelperProgramFaultMessage.declared().key, context)
