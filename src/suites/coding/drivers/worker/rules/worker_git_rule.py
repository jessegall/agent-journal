from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer


class WorkerGitRule(DriverRule):
    """A worker runs no git: the journal commits, rebases and merges its worktree."""

    name = "workers.no-git"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is not None and any(part.program == "git" for part in shell.parts):
            return RuleAnswer.refused("a worker runs no git: the journal commits and merges your work")
        return RuleAnswer.allowed()
