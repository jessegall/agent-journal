from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.registry.default_state_entry import DefaultStateEntry
from engine.registry.registry import Registry
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.agent_state_listing import AgentStateListing, StateType


class DriverStateTypesSubcommand(ReadSubcommand[list[StateType] | list[DefaultStateEntry]]):
    """`journal driver state-types`: every kind of state the installed modules register, with the module that adds
    it, its shape, tier, drivers and role, the rules it gates with their hooks, and its deferred rules and substates;
    with --defaults, the states each suite gives its agents by default, by role, driver and helper type."""

    cli_name = "driver"
    name = "state-types"

    def __init__(self, listing: AgentStateListing, registry: Registry) -> None:
        self.listing, self.registry = listing, registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--defaults", action="store_true", help="the states each suite gives its agents by default")

    def read(self, arguments: Namespace, caller: Caller) -> list[StateType] | list[DefaultStateEntry]:
        if arguments.defaults:
            return sorted((default for suite in self.registry.suites for default in suite.default_states), key=lambda default: (default.kind, default.value, default.state))
        return self.listing.types()
