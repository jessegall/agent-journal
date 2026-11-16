from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.button_condition import ButtonCondition
from engine.viewer.text_field import TextField


class WorkersReleaseButton(ButtonDeclaration):
    """The button workers.release."""

    name = "workers.release"
    slots = ("row.agent",)
    label = "Release the worker from its task"
    runs = "worker release row:{row_id} --reason={reason}"
    icon = "restore"
    condition = ButtonCondition("working_role", ("worker",))
    fields = (TextField("reason", "Why is it taken off its task?"),)
