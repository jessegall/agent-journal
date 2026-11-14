from core.modules.dumps.commands.dump_item.dump_item_subcommand import DumpItemSubcommand


class FailDumpItemSubcommand(DumpItemSubcommand):
    """`journal dump failed <dump> <item> "<why>"`."""

    action = "failed"
    name = "failed"
