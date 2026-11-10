import shlex
from pathlib import Path
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.command_category import CommandCategory
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.triggers.commands.start_trigger_action.start_trigger_action import StartTriggerAction
from core.modules.triggers.models.trigger_action_run import TriggerActionRun


class StartTriggerActionHandler(Handler[StartTriggerAction, Process]):
    command = StartTriggerAction

    def __init__(self, bus: Bus, repository: Repository, home: JournalHome) -> None:
        self.bus, self.repository, self.home = bus, repository, home

    def handle(self, command: StartTriggerAction, context: Context) -> Process:
        folder = self.home.project_folder
        if command.action.folder is not None:
            folder = (folder / Path(command.action.folder).expanduser()).resolve()
        if not folder.is_dir():
            raise Refusal(f"the command folder does not exist: {folder}", "choose an existing folder")
        line = shlex.join(command.action.program_arguments())
        process = self.bus.dispatch(StartProcess.single_part(command.agent_id, line, str(folder), CommandCategory.UNKNOWN, 0), context)
        self.repository.save(TriggerActionRun(creator_id=context.actor.id, trigger_id=command.trigger_id, process_id=process.id, notify_agent=command.action.notify_agent), context)
        return process
