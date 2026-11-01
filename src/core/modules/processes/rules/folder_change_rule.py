from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer

CHANGE_WORD = "cd"


class FolderChangeRule(DriverRule):
    """An agent does not move to another folder with cd; a cd into the folder it is already in does nothing and goes
    through."""

    name = "processes.folder-change"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        folder = str(hook.event.raw.get("cwd", "")).rstrip("/")
        for part in shell.parts:
            if part.program == CHANGE_WORD and [argument.rstrip("/") for argument in part.arguments] != [folder]:
                return RuleAnswer.refused(f"do not move with cd: you are in {folder or 'the project'}, so name paths from there; a tool takes its own folder, such as npm --prefix or vitest --root")
        return RuleAnswer.allowed()
