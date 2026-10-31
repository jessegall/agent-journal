from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.commands.record_file_edit import RecordFileEdit


class RecordFileEditRule(DriverRule):
    """Each file an agent edits or writes is kept as a file edit, with its path and its line counts, for the
    file feed and the file edits windows."""

    name = "coding.record-file-edit"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["coding.*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.diff is None or not tool.is_writing_files():
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(RecordFileEdit(hook.agent_id, hook.environment_id, tool.diff))
