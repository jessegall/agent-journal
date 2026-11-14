from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.driver.nudger import Nudger
from core.modules.processes.models.process import Process
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.triggers.commands.deliver_trigger_output.deliver_trigger_output import DeliverTriggerOutput
from core.modules.triggers.models.trigger_action_run import TriggerActionRun

OUTPUT_LIMIT_CHARACTERS = 12000


class DeliverTriggerOutputHandler(Handler[DeliverTriggerOutput, TriggerActionRun]):
    command = DeliverTriggerOutput

    def __init__(self, queries: Queries, repository: Repository, folder: OutputFolder, nudger: Nudger) -> None:
        self.queries, self.repository, self.folder, self.nudger = queries, repository, folder, nudger

    def handle(self, command: DeliverTriggerOutput, context: Context) -> TriggerActionRun:
        run = self.queries.query(TriggerActionRun).find(command.action_run_id)
        process = self.queries.query(Process).find(run.process_id)
        if run.delivered_at is not None or not run.notify_agent or process.state in RUNNING_STATES:
            return run
        lines = self.folder.numbered_lines(process.id, 1, 200)
        text = "\n".join(line for _, line in lines)[:OUTPUT_LIMIT_CHARACTERS]
        message = f"Trigger {run.trigger_id} command output {process.id}, {process.state}, exit {process.exit_code}:\n{text}\nFirst 200 lines, up to {OUTPUT_LIMIT_CHARACTERS} characters. Full output: journal output read {process.id} --all"
        self.nudger.send_text(process.session_agent_id, message, "triggers.command-output", context, wakes_agent=True)
        return self.repository.update(run, context, delivered_at=context.timestamp)
