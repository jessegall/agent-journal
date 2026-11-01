from argparse import ArgumentParser, Namespace

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.driver.hook_event_name import HookEventName
from core.base.environment_names import EnvironmentNames
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall

TURN_HOOKS = (HookEventName.PRE_TOOL_USE, HookEventName.STOP, HookEventName.PROMPT, HookEventName.SESSION_START)


class UsageToolSubcommand(ReadSubcommand[str]):
    """`journal usage tool [--environment <name>]`: the tool the main agent last began, empty once
    it has stopped or a new turn began."""

    cli_name = "usage"
    name = "tool"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> str:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the tool is shown for one environment", "name it with --environment")
        mains = self.queries.query(Agent).filter(environment_id=environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().page(1, 1).rows
        if not mains:
            return ""
        calls = self.queries.query(HookCall).filter(agent_id=mains[0].id).matching(Among("hook", TURN_HOOKS)).newest().page(1, 1).rows
        return " ".join(part for part in (calls[0].tool, calls[0].summary) if part) if calls and calls[0].hook == HookEventName.PRE_TOOL_USE else ""

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, str):
            output.write(value, {"tool": value})
