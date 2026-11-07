from suites.coding.modules.workers.commands.worker_points.worker_points_subcommand import WorkerPointsSubcommand


class ProofPointsSubcommand(WorkerPointsSubcommand):
    """`journal proof points --agent <n>`: the same points, named for the proofs so the points window may
    follow their events."""

    cli_name = "proof"
