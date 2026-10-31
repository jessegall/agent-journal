from core.modules.sequences.commands.support.run_move_subcommand import RunMoveSubcommand


class NextStepSubcommand(RunMoveSubcommand):
    """`journal sequence next`."""

    action = "next"
    name = "next"
