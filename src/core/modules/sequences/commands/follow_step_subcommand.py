from core.modules.sequences.commands.support.run_move_subcommand import RunMoveSubcommand


class FollowStepSubcommand(RunMoveSubcommand):
    """`journal sequence follow`."""

    action = "follow"
    name = "follow"
