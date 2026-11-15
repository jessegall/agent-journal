from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.button_condition import ButtonCondition
from engine.viewer.text_field import TextField


class WorkersSendJobButton(ButtonDeclaration):
    """The button workers.send-job."""

    name = "workers.send-job"
    slots = tuple(["row.agent"])
    label = "Send the worker a job"
    runs = "worker send row:{row_id} --job={job}"
    icon = "send"
    condition = ButtonCondition("working_role", tuple(["worker"]))
    fields = tuple([TextField("job", "What should it do?")])
