from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.support.agent_state_listing import AgentStateListing, AgentStates


class DriverStatesSubcommand(ReadSubcommand[AgentStates]):
    """`journal driver states <agent>`: the states the agent is in as a hook of now would find them, by tier, each with
    the rows that hold it open and since when; a tier with no open state says (none)."""

    cli_name = "driver"
    name = "states"

    def __init__(self, listing: AgentStateListing, agents: AgentRows, clock: Clock) -> None:
        self.listing, self.agents, self.clock = listing, agents, clock

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent", type=AgentNumber)

    def read(self, arguments: Namespace, caller: Caller) -> AgentStates:
        return self.listing.states(self.agents.find(arguments.agent), self.clock.timestamp())
