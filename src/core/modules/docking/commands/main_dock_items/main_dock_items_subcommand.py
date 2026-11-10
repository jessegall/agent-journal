from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.row.page import Page, is_page
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS
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
    environment_refusal = "the main chat is shown for one environment"

    def __init__(self, queries: Queries, items: DockItemQuery) -> None:
        self.queries, self.items = queries, items

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)

    def read(self, arguments: Namespace, caller: Caller) -> Page[DockItem]:
        dock = next(self.queries.query(Dock).all_rows(), None)
        return self.items.filter(dock_id=dock.id if dock else 0).same_chat(None).newest().page(1, arguments.limit)

    def write_output(self, value: object, output: Output) -> None:
        if is_page(value):
            output.page(value, ())
