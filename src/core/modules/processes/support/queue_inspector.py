from engine.viewer.button_condition import ButtonCondition
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.inspector_component import InspectorComponent
from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.enums.inspector_width import InspectorWidth
from engine.viewer.text_field import TextField
from core.modules.processes.models.process_queue_row import ProcessQueueRow

QUEUE_INSPECTOR = InspectorDeclaration(
    ProcessQueueRow,
    reads="queue list",
    label="Process queue",
    title="Process queue",
    width=InspectorWidth.MEDIUM,
    events=tuple(["process.*"]),
    actions=(
        ButtonDeclaration("processes.halt-queue", (), "Halt the queue", "queue halt --reason={reason}", icon="stop", condition=ButtonCondition("halt_state", tuple(["running"])),
                          fields=tuple([TextField("reason", "Why is it halted?")])),
        ButtonDeclaration("processes.resume-queue", (), "Resume the queue", "queue resume", icon="resume", primary=True, condition=ButtonCondition("halt_state", tuple(["halted"]))),
    ),
    components=tuple([InspectorComponent("processes.queue-body")]),
    links=None,
    labelled="test-queue",
)
