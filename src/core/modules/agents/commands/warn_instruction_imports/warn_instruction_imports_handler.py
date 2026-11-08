from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.journal_home import JournalHome
from core.modules.agents.commands.warn_instruction_imports.warn_instruction_imports import WarnInstructionImports
from core.modules.agents.support.instruction_imports import IMPORT_CYCLE, IMPORT_TWICE, InstructionImports
from core.modules.drivers.support.nudger import Nudger

SOURCE = "agents.instruction-imports"


class WarnInstructionImportsHandler(Handler[WarnInstructionImports, None]):
    """Scans the project's instruction files and sends the agent a line for each import that puts the same text into
    its context twice."""

    command = WarnInstructionImports

    def __init__(self, home: JournalHome, nudger: Nudger) -> None:
        self.home, self.nudger = home, nudger

    def handle(self, command: WarnInstructionImports, context: Context) -> None:
        for fault in InstructionImports(self.home.project_folder).faults():
            if fault.count > 1:
                self.nudger.send(command.agent_id, IMPORT_TWICE, SOURCE, context, path=fault.file, other=fault.imported, count=fault.count)
            if fault.imports_back:
                self.nudger.send(command.agent_id, IMPORT_CYCLE, SOURCE, context, path=fault.file, other=fault.imported)
