from core.modules.dumps.commands.dump_item_subcommand import DumpItemSubcommand


class NoteItemSubcommand(DumpItemSubcommand):
    """`journal dump note <dump> <item> "<what is in it>"`."""

    action = "note"
    name = "note"
