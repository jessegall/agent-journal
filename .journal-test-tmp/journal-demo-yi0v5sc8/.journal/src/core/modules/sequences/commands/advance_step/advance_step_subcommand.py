from core.modules.sequences.commands.move_sequence_run.run_move_subcommand import RunMoveSubcommand


class AdvanceStepSubcommand(RunMoveSubcommand):
    """`journal sequence next`."""

    action = "next"
    name = "next"
