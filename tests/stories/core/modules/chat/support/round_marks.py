from engine.event.changed import Changed
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from tests.stories.core.modules.chat.support.mark_samples import ChatSampleModule, SampleMarkType, SampleMarkVariant

PATH = "tests.stories.core.modules.chat.support.round_marks:TaskMarkSampleModule"
KEY = "sample-task:1"


class TaskRoundListener(MarkListener[Changed[Task]]):
    name = "chatsample.task-round"
    module_name = "chatsample"

    def handle(self, event: Changed[Task], logged: LoggedEvent) -> None:
        self.show(logged, SampleMarkType.PROCESS, SampleMarkVariant.PLAIN, f"Task {event.row.id}",
                  key=f"sample-task:{event.row.id}", ended=event.row.state is TaskState.COMPLETED)


class GuardedMarkListener(MarkListener[Created[Task]]):
    name = "chatsample.refused-mark"
    module_name = "journal.core.memories"

    def handle(self, event: Created[Task], logged: LoggedEvent) -> None:
        self.show(logged, SampleMarkType.EVENT_TYPE, SampleMarkVariant.PLAIN, "Refused mark", event.row.environment_id)


class TaskMarkSampleModule(ChatSampleModule):
    listeners = [TaskRoundListener, GuardedMarkListener]
