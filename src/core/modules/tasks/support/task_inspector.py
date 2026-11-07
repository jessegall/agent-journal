from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.inspector_links import InspectorLinks
from core.base.viewer.inspector_width import InspectorWidth
from core.base.viewer.text_field import TextField
from core.modules.tasks.models.task import Task

OPEN_STATES = ("open", "started", "testing", "blocked")

TASK_INSPECTOR = InspectorDeclaration(
    Task,
    reads="task inspect {row_id}",
    label="Task {id} · {state}",
    title="{title}",
    width=InspectorWidth.MEDIUM,
    comments=True,
    events=("task.*",),
    actions=(
        ButtonDeclaration("tasks.complete", (), "Complete the task", "task close {row_id} --outcome={outcome}", icon="tick", primary=True,
                          condition=ButtonCondition("state", ("started", "testing")), fields=(TextField("outcome", "What was the outcome?"),)),
        ButtonDeclaration("tasks.block", (), "Block the task", "task block {row_id} --reason={reason}", icon="lock",
                          condition=ButtonCondition("state", ("open", "started")), fields=(TextField("reason", "What does it wait on?"),)),
        ButtonDeclaration("tasks.unblock", (), "Unblock the task", "task unblock {row_id}", icon="resume", primary=True, condition=ButtonCondition("state", ("blocked",))),
        ButtonDeclaration("tasks.retest", (), "Send the task back to work", "task retest {row_id}", icon="restore", condition=ButtonCondition("state", ("testing",))),
        ButtonDeclaration("tasks.cancel", (), "Cancel the task", "task cancel {row_id} --reason={reason}", icon="stop", danger=True,
                          condition=ButtonCondition("state", OPEN_STATES), fields=(TextField("reason", "Why is it cancelled?"),)),
        ButtonDeclaration("tasks.reopen", (), "Reopen the task", "task reopen {row_id}", icon="restore", condition=ButtonCondition("state", ("completed", "cancelled"))),
    ),
    components=(InspectorComponent("tasks.task-details"), InspectorComponent("tasks.task-chain"), InspectorComponent("tasks.task-log", tab="Log")),
    links=InspectorLinks(),
)
