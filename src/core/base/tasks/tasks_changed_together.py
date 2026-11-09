from core.base.tasks.task_waits_updated_together import TaskWaitsUpdatedTogether


class TasksChangedTogether(TaskWaitsUpdatedTogether):
    """Marks a command that updates the waits of every task it changes and also hands those tasks over itself,
    so the listeners that would do either leave its changes to it."""
