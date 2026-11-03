from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.page import Page, is_page
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery


class MainDockItemsSubcommand(ReadSubcommand[Page[DockItem]]):
    """`journal dock-item main`: the items of an environment's dock the main chat shows, newest first, a page at
    a time."""

    cli_name = "dock-item"
    name = "main"

    def __init__(self, queries: Queries, items: DockItemQuery, environment_names: EnvironmentNames) -> None:
        self.queries, self.items, self.environment_names = queries, items, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)

    def read(self, arguments: Namespace, caller: Caller) -> Page[DockItem]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        if environment_id is None:
            raise Refusal("the main chat is shown for one environment", "name it with --environment")
        dock = next(self.queries.query(Dock).filter(environment_id=environment_id).all_rows(), None)
        return self.items.filter(dock_id=dock.id if dock else 0).same_chat(None).newest().page(1, arguments.limit)

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value, ())
