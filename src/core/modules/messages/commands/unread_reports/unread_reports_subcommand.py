from argparse import ArgumentParser, Namespace

from engine.enums.actor_type import ActorType
from core.base.caller.caller import Caller
from engine.query.conditions.contains_every import ContainsEvery
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.commands.unread_reports.support.unread_reports import UnreadReports

SHOWN_REPORTS = 20
TITLE_CHARACTERS = 100


class UnreadReportsSubcommand(ReadSubcommand[UnreadReports]):
    """`journal message reports`: the newest reports sent to the caller that nobody has read yet, with their numbers
    and how many more there are: a helper reads those sent to it, and a main agent or a person those sent
    to the main agent."""

    cli_name = "message"
    name = "reports"

    def __init__(self, queries: Queries, agents: AgentRows) -> None:
        self.queries, self.agents = queries, agents

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--search", default="")
        parser.add_argument("--agent", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> UnreadReports:
        reports = self.queries.query(Message).filter(type=MessageType.AGENT, is_chat_visible=False).matching(IsNull("read_at"))
        if self.reads_caller_reports(caller):
            reports = reports.filter(target_agent_id=caller.actor.id)
        else:
            reports = reports.matching(IsNull("target_agent_id"))
        if arguments.agent is not None:
            reports = reports.filter(session_agent_id=arguments.agent)
        if arguments.search:
            reports = reports.matching(ContainsEvery(["text"], arguments.search.split()))
        page = reports.newest().page(arguments.page, SHOWN_REPORTS)
        return UnreadReports(tuple(reversed(page.rows)), page.total, arguments.page)

    def reads_caller_reports(self, caller: Caller) -> bool:
        return caller.actor.type is ActorType.AGENT and not self.agents.is_main(caller.actor.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, UnreadReports):
            lines = [f"message:{report.id} from agent:{report.session_agent_id}: {report.text.splitlines()[0][:TITLE_CHARACTERS] if report.text else ''}" for report in value.reports]
            older = value.total - value.page * SHOWN_REPORTS
            text = "\n".join([*lines, f"{older} older unread reports: --page {value.page + 1}"] if older > 0 else lines)
            output.write(text or "no unread reports", {"rows": [report.id for report in value.reports], "total": value.total})
