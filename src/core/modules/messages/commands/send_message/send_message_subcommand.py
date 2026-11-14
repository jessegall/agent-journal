from argparse import ArgumentParser, Namespace
from engine.caller.caller import Caller
from engine.cli.agent_number import AGENT_MODEL_NAME, AgentNumber
from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message

AGENT_PREFIX = "agent:"


class SendMessageSubcommand(Subcommand[SendMessage | SendAgentMessage, Message]):
    """`journal message send "<text>"`: writes a message as the caller; messages have no make subcommand. With
    `--to agent:N` it is a private message to that agent, the one way to message an agent."""

    cli_name = "message"
    name = "send"

    def __init__(self, numbers: RowNumbers) -> None:
        self.numbers = numbers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")
        parser.add_argument("--file", action="append", default=[], dest="files")
        parser.add_argument("--target-agent", type=AgentNumber)
        parser.add_argument("--to")

    def command(self, arguments: Namespace, caller: Caller) -> SendMessage | SendAgentMessage:
        if arguments.to is None:
            return SendMessage(arguments.text, files=tuple(arguments.files), target_agent_id=arguments.target_agent)
        if not arguments.to.startswith(AGENT_PREFIX) or not arguments.to[len(AGENT_PREFIX):].isdigit():
            raise Refusal(f"{arguments.to} is not an agent", "name it as agent:N")
        try:
            number = AgentNumber(arguments.to[len(AGENT_PREFIX):])
        except ValueError:
            raise Refusal(f"{arguments.to} is not an agent", "name it as agent:N") from None
        return SendAgentMessage(self.numbers.row_id(AGENT_MODEL_NAME, int(number), caller.environment_id), arguments.text)
