from dataclasses import replace

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.file.file_access import FileAccess
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plugins.commands.deliver_file_edit.deliver_file_edit import DeliverFileEdit
from core.modules.processes.models.process import Process
from suites.coding.commands.record_file_changes.record_file_changes import RecordFileChanges
from suites.coding.commands.prune_file_edits.prune_file_edits import PruneFileEdits
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit
from suites.coding.support.file_change_report import FileChangeReport
from suites.coding.support.managed_files import ManagedFiles


class RecordFileChangesHandler(Handler[RecordFileChanges, None]):
    """Keeps each file of a scan's report as a file edit of the agent it followed, tells the plugins, and prunes the
    oldest edits once for the whole report; the one place a file edit is born."""

    command = RecordFileChanges

    def __init__(self, queries: Queries, bus: Bus, files: FileAccess, scopes: Scopes, agents: AgentRows, managed_files: ManagedFiles) -> None:
        self.queries, self.bus, self.files, self.scopes, self.agents, self.managed_files = queries, bus, files, scopes, agents, managed_files

    def handle(self, command: RecordFileChanges, context: Context) -> None:
        agent = self.scan_agent(command)
        report = FileChangeReport.parsed(self.files.read(command.report_path))
        scoped = replace(context, environment_id=agent.environment_id)
        with self.scopes.opened(None, agent.environment_id):
            for change in [change for change in report.changes if not self.managed_files.has(agent, change.diff.path)]:
                self.bus.dispatch(RecordFileEdit(agent.id, change.diff, change.rows, change.old_path), scoped)
                self.bus.dispatch(DeliverFileEdit(agent.id, change.diff.path, report.folder, change.rows), scoped)
            self.bus.dispatch(PruneFileEdits(), scoped)

    def scan_agent(self, command: RecordFileChanges) -> Agent:
        if command.process_id is not None:
            return self.queries.query(Agent).find(self.queries.query(Process).find(command.process_id).session_agent_id)
        agent = self.agents.session(command.session)
        if agent is None:
            raise Refusal(f"no agent has session {command.session}", "name a process or a session the journal knows")
        return agent
