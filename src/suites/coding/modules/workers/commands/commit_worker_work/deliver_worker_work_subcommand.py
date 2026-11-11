from suites.coding.modules.workers.commands.commit_worker_work.commit_worker_work_subcommand import CommitWorkerWorkSubcommand


class DeliverWorkerWorkSubcommand(CommitWorkerWorkSubcommand):
    """`journal worker deliver`: a second name of `journal worker commit`."""

    name = "deliver"
