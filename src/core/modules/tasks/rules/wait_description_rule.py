import re

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.tasks.support.task_nudges import PLAIN_BLOCK, WAIT_DESCRIPTION
from core.modules.tasks.support.task_wait_targets import TaskWaitTargets


WAIT_TERMS = re.compile(r"\b(wait(s|ing)?\s+(for|on|until)|blocked\s+(on|by|until))\b", re.I)
DESCRIBING_COMMANDS = ("task log", "task block", "message send", "message reply")
BLOCK_FLAGS = ("--on", "--until")


class WaitDescriptionRule(DriverRule):
    """A log line, a block's reason or a message that says the work waits, in words, teaches the block that
    opens by itself."""

    name = "tasks.wait-in-words"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def __init__(self, targets: TaskWaitTargets) -> None:
        self.targets = targets

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        described = shell.parts_running_journal_command(*DESCRIBING_COMMANDS) if shell is not None else ()
        if any(part.arguments[:2] == ("task", "block") and any(arg == "--reason" or arg.startswith("--reason=") for arg in part.arguments)
               and not any(arg.split("=", 1)[0] in (*BLOCK_FLAGS, "--until-user") for arg in part.arguments) for part in described):
            return RuleAnswer.with_nudges(PLAIN_BLOCK.nudge(targets=", ".join(self.targets.target_types)))
        if not any(WAIT_TERMS.search(part.text) and not set(BLOCK_FLAGS) & set(part.arguments) for part in described):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(WAIT_DESCRIPTION.nudge())
