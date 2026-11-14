from argparse import Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.agent_state_listing import AgentStateListing, StateType


class DriverStateTypesSubcommand(ReadSubcommand[list[StateType]]):
    """`journal driver state-types`: every kind of state the installed modules register, with the module that adds
    it, its shape, tier, drivers and role, the rules it gates with their hooks, and its deferred rules and substates."""

    cli_name = "driver"
    name = "state-types"

    def __init__(self, listing: AgentStateListing) -> None:
        self.listing = listing

    def read(self, arguments: Namespace, caller: Caller) -> list[StateType]:
        return self.listing.types()
