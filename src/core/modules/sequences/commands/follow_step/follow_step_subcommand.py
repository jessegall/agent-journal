from core.modules.sequences.commands.move_sequence_run.run_move_subcommand import RunMoveSubcommand


class FollowStepSubcommand(RunMoveSubcommand):
    """`journal sequence follow`."""

    action = "follow"
    name = "follow"
