from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.command.request_user_approval import RequestUserApproval
from core.base.instruction_imports import InstructionImports
from core.base.journal_home import JournalHome
from core.base.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.commands.remove_instruction_import.remove_instruction_import_handler import COMMAND_WORDS, InstructionImportQuestion
from core.modules.agents.commands.warn_instruction_imports.warn_instruction_imports import WarnInstructionImports


class WarnInstructionImportsHandler(Handler[WarnInstructionImports, None]):
    """Scans the project's instruction files and puts an approval card in the chat for each import that puts the same
    text into the context twice; accepting it removes the line."""

    command = WarnInstructionImports

    def __init__(self, home: JournalHome, bus: Bus) -> None:
        self.home, self.bus = home, bus

    def handle(self, command: WarnInstructionImports, context: Context) -> None:
        for fault in InstructionImports(self.home.project_folder).faults():
            arguments = (*COMMAND_WORDS, fault.file, fault.imported)
            approval = UserApprovalRefusal(InstructionImportQuestion.text(fault.file, fault.imported), arguments,
                                           why=f"{fault.file} imports {fault.imported}, which puts the same text into the agent's context twice.")
            self.bus.dispatch(RequestUserApproval(approval, arguments, command.agent_id), context)
