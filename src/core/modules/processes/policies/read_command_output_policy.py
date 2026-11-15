from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.processes.agent_messages.read_command_output_message import ReadCommandOutputMessage
from core.modules.processes.support.read_commands import ReadCommands


class ReadCommandOutputPolicy(EventPolicy):
    """Keeps the output of commands that count as reading in the agent's tool response."""

    key = "processes.read-command-output"
    rank = "shell.all"

    def __init__(self, commands: ReadCommands) -> None:
        self.commands = commands

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error:
            return None
        for part in shell.parts:
            if any(arguments[:len(tokens)] == tokens for arguments in part.nested_journal_commands
                   for tokens in (tuple(command.split()) for command in self.commands.names())):
                return ReadCommandOutputMessage.declared().agent_message()
        for part in shell.parts_running_journal_command(*self.commands.names()):
            if part.pipe_target is not None or any(redirect in part.text for redirect in shell.redirects):
                return ReadCommandOutputMessage.declared().agent_message()
        return None
