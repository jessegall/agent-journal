from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class AgentReportsSubcommand(ReadSubcommand[tuple[Message, ...]]):
    """The private reports sent by an agent, newest first."""

    cli_name = "message"
    name = "agent-reports"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--agent", type=int, default=0)

    def read(self, arguments: Namespace, caller: Caller) -> tuple[Message, ...]:
        return tuple(self.queries.query(Message).filter(session_agent_id=arguments.agent, type=MessageType.AGENT, is_chat_visible=False).newest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            rows = [output.values(message) for message in value if isinstance(message, Message)]
            output.write("\n".join(str(row["id"]) for row in rows) or "no reports", {"rows": rows})
