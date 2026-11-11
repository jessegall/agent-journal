from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.command.handler import Handler
from engine.file.file_access import FileAccess
from engine.instruction.instruction_imports import INSTRUCTION_FILES, InstructionImports
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.commands.remove_instruction_import.remove_instruction_import import RemoveInstructionImport
from core.modules.agents.commands.remove_instruction_import.support.instruction_import_question import InstructionImportQuestion

COMMAND_NAME_PARTS = ("instruction-import", "remove")


class RemoveInstructionImportHandler(Handler[RemoveInstructionImport, str]):
    """Removes the extra import lines of a file from an instruction file, or its one import line when two
    files import each other; it changes a person's file, so anyone else is asked through an approval card."""

    command = RemoveInstructionImport

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def handle(self, command: RemoveInstructionImport, context: Context) -> str:
        if context.actor.type is not ActorType.USER:
            raise UserApprovalRefusal(InstructionImportQuestion.text(command.file, command.imported), command=command)
        project = self.home.project_folder.resolve()
        file = (project / command.file).resolve()
        if file.name not in INSTRUCTION_FILES or not file.is_relative_to(project) or not file.is_file():
            raise Refusal(f"{command.file} is not a CLAUDE.md or AGENTS.md file of this project", "name the file as the approval card does")
        FileAccess.shared().write(file, InstructionImports.without_import(FileAccess.shared().read(file), command.imported))
        return f"{command.file} imports {command.imported} once less"
