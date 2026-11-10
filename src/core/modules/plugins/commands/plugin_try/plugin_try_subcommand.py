from argparse import ArgumentParser, Namespace

from engine.enums.actor_type import ActorType
from core.base.caller.caller import Caller
from engine.query.queries import Queries
from core.base.scope.environment_scope import EnvironmentScope
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.plugins.support.plugin_call_access import PluginCallAccess
from core.modules.plugins.support.plugin_try import PluginTry
from core.modules.plugins.support.plugin_try_run import PluginTryRun


class PluginTrySubcommand(ReadSubcommand[PluginTryRun]):
    """Runs a plugin script and shows its input and answer without applying the answer."""

    cli_name = "plugin"
    name = "try"
    outward = True
    disabled_scopes = tuple([EnvironmentScope])

    def __init__(self, tries: PluginTry, access: PluginCallAccess, queries: Queries) -> None:
        self.tries, self.access, self.queries = tries, access, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("name")
        parser.add_argument("key")
        parser.add_argument("--agent", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> PluginTryRun:
        if arguments.agent is None and caller.actor.type is not ActorType.AGENT:
            return self.tries.run(arguments.name, arguments.key, None, caller.environment_id)
        agent_id = self.access.agent_id(arguments.agent, caller)
        return self.tries.run(arguments.name, arguments.key, agent_id, self.queries.query(Agent).find(agent_id).environment_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PluginTryRun):
            output.write(value.text(), value.values())
