from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.rule_answer import RuleAnswer
from core.suites.coding.file_edit_record import FileEditRecord


class RecordFileEdit(DriverRule):
    """Each file an agent edits or writes is kept as a file edit, with its path and its line counts, for the
    file feed and the file edits windows."""

    name = "coding.record-file-edit"
    hook = "post_tool_use"
    drivers = ["coding.*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.diff is None or not tool.is_writing_files():
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(FileEditRecord(hook.agent_id, hook.environment_id, tool.diff))
