from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.command.request_user_approval import RequestUserApproval
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.commands.remove_instruction_import.remove_instruction_import_handler import COMMAND_NAME_PARTS
from core.modules.agents.commands.remove_instruction_import.support.instruction_import_question import InstructionImportQuestion
from core.modules.agents.commands.warn_instruction_imports.warn_instruction_imports import WarnInstructionImports


class WarnInstructionImportsHandler(Handler[WarnInstructionImports, None]):
    """Puts an approval card in the chat for each import that puts the same
    text into the context twice; accepting it removes the line."""

    command = WarnInstructionImports

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command: WarnInstructionImports, context: Context) -> None:
        for fault in command.faults:
            arguments = (*COMMAND_NAME_PARTS, fault.file, fault.imported)
            approval = UserApprovalRefusal(InstructionImportQuestion.text(fault.file, fault.imported), arguments,
                                           request_reason=f"{fault.file} imports {fault.imported}, which puts the same text into the agent's context twice.")
            self.bus.dispatch(RequestUserApproval(approval, arguments, command.agent_id), context)
