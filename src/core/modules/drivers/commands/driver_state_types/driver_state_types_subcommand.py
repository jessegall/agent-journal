from argparse import ArgumentParser, Namespace
from dataclasses import asdict

from engine.caller.caller import Caller
from engine.registry.default_state_entry import DefaultStateEntry
from engine.registry.registry import Registry
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.row_list import RowList
from core.modules.drivers.support.agent_state_listing import AgentStateListing, StateType


class DriverStateTypesSubcommand(ReadSubcommand[RowList]):
    """`journal driver state-types`: every kind of state the installed modules register, with the module
    that adds it, its shape, tier, drivers and role, the rules it gates with their hooks, and its deferred
    rules and substates; with --defaults, the states each suite gives its agents by default, by role,
    driver and helper type."""

    cli_name = "driver"
    name = "state-types"
    row_line = "{line}"
    empty_line = "no states"

    def __init__(self, listing: AgentStateListing, registry: Registry) -> None:
        self.listing, self.registry = listing, registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--defaults", action="store_true", help="the states each suite gives its agents by default")

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        if arguments.defaults:
            defaults = sorted((default for suite in self.registry.suites for default in suite.default_states), key=lambda default: (default.kind, default.value, default.state))
            return RowList([self.default_row(default) for default in defaults])
        return RowList([self.type_row(state_type) for state_type in self.listing.types()])

    @staticmethod
    def type_row(state_type: StateType) -> dict[str, object]:
        line = f"{state_type.name} ({state_type.owner}): {state_type.shape}, {state_type.tier}, drivers {state_type.drivers}, roles {state_type.roles}; rules {state_type.rules}; deferred {state_type.deferred}; substates {state_type.substates}"
        return {**asdict(state_type), "line": line}

    @staticmethod
    def default_row(default: DefaultStateEntry) -> dict[str, object]:
        line = f"{default.state}: given to {default.kind.value} {default.value}" + (f", taken away while {default.removed_while} is open" if default.removed_while else "")
        return {"state": default.state, "kind": default.kind.value, "value": default.value, "removed_while": default.removed_while, "line": line}
