from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery


class PluginListSubcommand(ReadSubcommand[Sequence[Plugin]]):
    """`journal plugin list`: each installed plugin, on or off, with its version."""

    cli_name = "plugin"
    name = "list"

    def __init__(self, plugins: PluginQuery) -> None:
        self.plugins = plugins

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Plugin]:
        return tuple(self.plugins.oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Plugin)] if is_tuple(value) else []
        text = "\n".join(f"{row.name:<20} {'on' if row.enabled else 'off'}  {row.release}{f'  last fault: {row.last_fault}' if row.fault_count else ''}"
                         for row in listed) or "no plugin is installed"
        output.write(text, {"rows": [output.values(row) for row in listed]})
