from core.modules.dumps.commands.dump_board.dump_board_subcommand import DumpBoardSubcommand


class DumpItemBoardSubcommand(DumpBoardSubcommand):
    """`journal dump-item board`: the same board, named for the items so the dumps window may follow their
    events."""

    cli_name = "dump-item"
