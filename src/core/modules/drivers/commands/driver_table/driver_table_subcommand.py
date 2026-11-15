import json
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.module.module_finder import ModuleFinder
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.models.driver_table import DriverTable


class DriverTableSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal driver table <driver>`: a driver of the new machine: its agent type, suite, work-stop
    contract, responder and rank order, then the newest compiled table, one contribution to a line."""

    cli_name = "driver"
    name = "table"

    def __init__(self, finder: ModuleFinder, queries: Queries) -> None:
        self.finder, self.queries = finder, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("driver")

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        drivers = {driver.name: driver for module in self.finder.modules() for driver in module.agent_drivers}
        driver = drivers.get(arguments.driver)
        if driver is None:
            raise Refusal(f"no installed module ships a driver {arguments.driver} of the new machine", f"the drivers are {', '.join(sorted(drivers))}")
        table = self.queries.query(DriverTable).filter(driver_name=driver.name).newest().first()
        manifest = json.loads(table.manifest) if table is not None else []
        return (f"{driver.name} ({driver.agent_type}, {driver.suite}, digest {table.digest if table is not None else 'not compiled yet'})",
                f"work stop: {driver.work_stop}    responder: {driver.responder}",
                f"policies in rank order: {', '.join(driver.rank_order.policies) or 'none yet'}",
                f"blocks in rank order: {', '.join(driver.rank_order.blocks) or 'none yet'}", *manifest)
