from core.modules.processes.commands.list_run_queue.list_run_queue_subcommand import ListRunQueueSubcommand


class InspectRunQueueSubcommand(ListRunQueueSubcommand):
    """Keeps the inspector command as an alias for the queue list read."""

    name = "inspect"
