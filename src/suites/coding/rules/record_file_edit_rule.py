from pathlib import Path

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.environments.models.environment import Environment
from suites.coding.commands.record_file_edit.record_file_edit import RecordFileEdit


class RecordFileEditRule(DriverRule):
    """Each file an agent edits or writes inside the project is kept as a file edit, with its path
    and its line counts, for the file feed and the file edits windows; a file elsewhere, such as in
    a temp folder, is left out."""

    name = "coding.record-file-edit"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["coding.*"]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.diff is None or not tool.is_writing_files() or self.is_external_path(tool.diff.path, hook.environment_id):
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordFileEdit(hook.agent_id, hook.environment_id, tool.diff, tool.diff_rows))

    def is_external_path(self, path: str, environment_id: int) -> bool:
        return Path(path).is_absolute() and not Path(path).is_relative_to(self.queries.query(Environment).find(environment_id).folder)
