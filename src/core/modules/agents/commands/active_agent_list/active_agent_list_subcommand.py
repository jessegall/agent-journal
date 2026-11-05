from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.page import Page, is_page
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent

ACTIVE_AGENTS_LIMIT_COUNT = 200


class ActiveAgentListSubcommand(ReadSubcommand[Page[Agent]]):
    """`journal agent running [--environment <name>]`: every agent of the environment still running, however long ago
    it started."""

    cli_name = "agent"
    name = "running"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> Page[Agent]:
        environment_id = caller.environment_id
        if environment_id is None:
            raise Refusal("the running agents are shown for one environment", "name it with --environment")
        return self.queries.query(Agent).filter(environment_id=environment_id).matching(IsNull("ended_at")).oldest().page(1, ACTIVE_AGENTS_LIMIT_COUNT)

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value)
