from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.button_condition import ButtonCondition


class WorkersMergeButton(ButtonDeclaration):
    """The button workers.merge."""

    name = "workers.merge"
    slots = ("row.agent",)
    label = "Merge the work of the worker"
    runs = "worker merge {row_id}"
    icon = "branch"
    primary = True
    condition = ButtonCondition("working_role", ("worker",))
    confirm = "Merge its work? Each point needs a checked proof."
