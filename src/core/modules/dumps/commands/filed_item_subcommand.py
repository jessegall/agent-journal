from core.modules.dumps.commands.dump_item_subcommand import DumpItemSubcommand


class FiledItemSubcommand(DumpItemSubcommand):
    """`journal dump filed <dump> <item> "<what was done>" [--refs tasks:1 ...]`."""

    action = "filed"
    name = "filed"
