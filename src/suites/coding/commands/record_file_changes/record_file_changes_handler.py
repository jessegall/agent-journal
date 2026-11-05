from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.file_access import FileAccess
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.plugins.commands.deliver_file_edit.deliver_file_edit import DeliverFileEdit
from core.modules.processes.models.process import Process
from suites.coding.commands.record_file_changes.record_file_changes import RecordFileChanges
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit
from suites.coding.support.file_change_report import FileChangeReport


class RecordFileChangesHandler(Handler[RecordFileChanges, None]):
    """Keeps each file of a scan's report as a file edit of the agent it followed, and tells the plugins; the one
    place a file edit is born."""

    command = RecordFileChanges

    def __init__(self, queries: Queries, bus: Bus, files: FileAccess) -> None:
        self.queries, self.bus, self.files = queries, bus, files

    def handle(self, command: RecordFileChanges, context: Context) -> None:
        agent = self.scan_agent(command)
        report = FileChangeReport.parsed(self.files.read(command.report_path))
        for change in report.changes:
            self.bus.dispatch(RecordFileEdit(agent.id, change.diff, change.rows), context)
            self.bus.dispatch(DeliverFileEdit(agent.id, change.diff.path, report.folder, change.rows), context)

    def scan_agent(self, command: RecordFileChanges) -> Agent:
        if command.process_id is not None:
            return self.queries.query(Agent).find(self.queries.query(Process).find(command.process_id).session_agent_id)
        agent = self.queries.query(Agent).filter(session=command.session).first()
        if agent is None:
            raise Refusal(f"no agent has session {command.session}", "name a process or a session the journal knows")
        return agent
