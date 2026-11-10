from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from core.base.registry.registry import Registry
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.base.viewer.window_key_line import WindowKeyLine
from core.modules.docking.models.dock_item import DockItem


LIST_COMMAND = "list"


class DockItemReadSubcommand(ReadSubcommand[WindowKeyLine]):
    """`journal dock-item read <item>`: the read that fills a docked card: the first read its type declares, of its
    target, with the rights of its type."""

    cli_name = "dock-item"
    name = "read"

    def __init__(self, queries: Queries, registry: Registry) -> None:
        self.queries, self.registry = queries, registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("item_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> WindowKeyLine:
        item = self.queries.query(DockItem).find(arguments.item_id)
        dock = self.registry.dock(item.type)
        read_line = dock.reads[0].split() if dock is not None and dock.reads else []
        is_item_read = dock is not None and dock.reads_target and bool(read_line) and item.target_id and read_line[-1] != LIST_COMMAND
        return WindowKeyLine(item.type, [*read_line, str(item.target_id)] if is_item_read else read_line)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, WindowKeyLine):
            output.write(" ".join(value.line), value.json())
