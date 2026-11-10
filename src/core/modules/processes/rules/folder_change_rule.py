from core.modules.processes.support.process_nudges import MOVE_BAN
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer

CHANGE_WORD = "cd"


class FolderChangeRule(DriverRule):
    """An agent does not move to another folder with cd; a cd into the folder it is already in does nothing
    and goes through."""

    name = "processes.folder-change"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "An agent does not move to another folder with cd"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        folder = str(hook.event.raw.get("cwd", "")).rstrip("/")
        for part in shell.parts:
            if part.program == CHANGE_WORD and [argument.rstrip("/") for argument in part.arguments] != [folder]:
                return RuleAnswer.refused(MOVE_BAN.nudge(folder=folder or "the project"))
        return RuleAnswer.allowed()
