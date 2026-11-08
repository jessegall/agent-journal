from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.inspector_width import InspectorWidth
from core.base.viewer.text_field import TextField
from core.modules.processes.models.process_queue_row import ProcessQueueRow

QUEUE_INSPECTOR = InspectorDeclaration(
    ProcessQueueRow,
    reads="queue list",
    label="Process queue",
    title="Process queue",
    width=InspectorWidth.MEDIUM,
    events=("process.*",),
    actions=(
        ButtonDeclaration("processes.halt-queue", (), "Halt the queue", "queue halt --reason={reason}", icon="stop", condition=ButtonCondition("halt_state", ("running",)),
                          fields=(TextField("reason", "Why is it halted?"),)),
        ButtonDeclaration("processes.resume-queue", (), "Resume the queue", "queue resume", icon="resume", primary=True, condition=ButtonCondition("halt_state", ("halted",))),
    ),
    components=(InspectorComponent("processes.queue-body"),),
    links=None,
    named="test-queue",
)
