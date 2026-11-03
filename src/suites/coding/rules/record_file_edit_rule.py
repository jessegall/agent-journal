from pathlib import Path

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit
from suites.coding.support.shell_file_changes import ShellFileChanges


class RecordFileEditRule(DriverRule):
    """Each file an agent edits or writes inside the project, with an edit tool or a shell command such as a
    script, is kept as a file edit, with its path and its line counts, for the file feed and the file edits
    windows; a file elsewhere, such as in a temp folder, is left out."""

    name = "coding.record-file-edit"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["coding.*"]

    def __init__(self, queries: Queries, changes: ShellFileChanges) -> None:
        self.queries, self.changes = queries, changes

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is not None and tool.shell is not None:
            return RuleAnswer.allowed().running(*self.shell_edits(hook, tool.shell))
        if tool is None or tool.diff is None or not tool.is_writing_files() or self.is_external_path(tool.diff.path, hook.environment_id):
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordFileEdit(hook.agent_id, hook.environment_id, tool.diff, tool.diff_rows))

    def shell_edits(self, hook: AgentHook, shell: ShellLine) -> list[RecordFileEdit]:
        paths = {path for part in shell.parts for path in part.output_paths if not self.is_external_path(path, hook.environment_id)}
        if not paths:
            return []
        cwd = hook.event.raw.get("cwd")
        folder = cwd if isinstance(cwd, str) else self.queries.query(Environment).find(hook.environment_id).folder
        changes = (self.changes.change(folder, path) for path in sorted(paths))
        return [RecordFileEdit(hook.agent_id, hook.environment_id, change.diff, change.rows) for change in changes if change is not None]

    def is_external_path(self, path: str, environment_id: int) -> bool:
        return Path(path).is_absolute() and not Path(path).is_relative_to(self.queries.query(Environment).find(environment_id).folder)
