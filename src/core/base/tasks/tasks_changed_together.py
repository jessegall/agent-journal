class TasksChangedTogether:
    """Marks a command that updates the waits of every task it changes itself, together through
    DependencyWaits.update_tasks, so the waiting-tasks listener leaves its changes to it."""
