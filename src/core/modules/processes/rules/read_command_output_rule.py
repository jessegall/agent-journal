from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.support.process_nudges import READ_COMMAND_OUTPUT
from core.modules.processes.support.read_commands import ReadCommands


class ReadCommandOutputRule(DriverRule):
    """Keeps the output of commands that count as reading in the agent's tool response."""

    name = "processes.read-command-output"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, commands: ReadCommands) -> None:
        self.commands = commands

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        for part in shell.parts:
            if any(arguments[:len(tokens)] == tokens for arguments in part.nested_journal_commands
                   for tokens in (tuple(command.split()) for command in self.commands.names())):
                return RuleAnswer.refused(READ_COMMAND_OUTPUT.nudge())
        for part in shell.parts_running_journal_command(*self.commands.names()):
            if part.pipe_target is not None or any(redirect in part.text for redirect in shell.redirects):
                return RuleAnswer.refused(READ_COMMAND_OUTPUT.nudge())
        return RuleAnswer.allowed()
