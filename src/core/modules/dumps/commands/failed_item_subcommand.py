from core.modules.dumps.commands.dump_item_subcommand import DumpItemSubcommand


class FailedItemSubcommand(DumpItemSubcommand):
    """`journal dump failed <dump> <item> "<why>"`."""

    action = "failed"
    name = "failed"
