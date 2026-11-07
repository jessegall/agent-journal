from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock


class SkipAgentBlockSubcommand(Subcommand[CloseAgentBlock, AgentBlock]):
    """`journal agent-block skip <n> --reason <why>`: leaves what a block waits for undone, saying why; the chat
    shows it."""

    cli_name = "agent-block"
    name = "skip"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_block_id", type=int)
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> CloseAgentBlock:
        if not arguments.reason.strip():
            raise Refusal("say why the line does not apply", "--reason '<why>'")
        return CloseAgentBlock(arguments.agent_block_id, arguments.reason.strip())

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentBlock):
            output.line(f"agent_block {value.id} skipped: {value.skip_reason}")
