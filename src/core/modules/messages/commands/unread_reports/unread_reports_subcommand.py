from argparse import Namespace

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class UnreadReportsSubcommand(ReadSubcommand[tuple[Message, ...]]):
    """`journal message reports`: the reports sent to the caller that nobody has read yet, with their numbers: a
    helper or worker reads those sent to it, and a main agent or a person those sent to the main agent."""

    cli_name = "message"
    name = "reports"

    def __init__(self, queries: Queries, agents: AgentRows) -> None:
        self.queries, self.agents = queries, agents

    def read(self, arguments: Namespace, caller: Caller) -> tuple[Message, ...]:
        reports = self.queries.query(Message).filter(type=MessageType.AGENT, is_chat_visible=False).matching(IsNull("read_at"))
        if self.reads_own_reports(caller):
            return tuple(reports.filter(target_agent_id=caller.actor.id).oldest().all_rows())
        return tuple(reports.matching(IsNull("target_agent_id")).oldest().all_rows())

    def reads_own_reports(self, caller: Caller) -> bool:
        return caller.actor.type is ActorType.AGENT and not self.agents.is_main(caller.actor.id)

    def write_output(self, value: object, output: Output) -> None:
        if is_tuple(value):
            lines = [f"message:{report.id} from agent:{report.session_agent_id}: journal message read {report.id}" for report in value if isinstance(report, Message)]
            output.write("\n".join(lines) or "no unread reports", {"rows": [report.id for report in value if isinstance(report, Message)]})
