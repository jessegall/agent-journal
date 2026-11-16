from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.viewer.button_condition import ButtonCondition
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.inspector_component import InspectorComponent
from engine.enums.inspector_width import InspectorWidth
from engine.viewer.text_field import TextField
from core.modules.processes.models.process_queue_row import ProcessQueueRow


class QueueInspector(InspectorDeclaration):
    """The inspector of ProcessQueueRow."""

    model = ProcessQueueRow
    reads = "queue list"
    label = "Process queue"
    title = "Process queue"
    width = InspectorWidth.MEDIUM
    events = ("process.*",)
    actions = (
        ButtonDeclaration("processes.halt-queue", (), "Halt the queue", "queue halt --reason={reason}", icon="stop", condition=ButtonCondition("halt_state", ("running",)),
                          fields=(TextField("reason", "Why is it halted?"),)),
        ButtonDeclaration("processes.resume-queue", (), "Resume the queue", "queue resume", icon="resume", primary=True, condition=ButtonCondition("halt_state", ("halted",))),
    )
    components = (InspectorComponent("processes.queue-body"),)
    links = None
    labelled = "test-queue"
