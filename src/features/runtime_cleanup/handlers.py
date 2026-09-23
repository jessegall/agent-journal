from dataclasses import dataclass
from typing import ClassVar

from engine.events import ClockTicked, ResourceEvent
from features.runtime_cleanup.tidy import tidy, tidy_files
from features.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from surfaces.updates import KIND


class TidyRuntime(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        tidy(context.record.root, context.settings.days)


@dataclass(frozen=True)
class NotificationCreated(ResourceEvent):
    on: ClassVar[str] = "notification.created"


class TidyAfterUpdate(Handler):
    def handle(self, context: Context, event: NotificationCreated) -> None:
        if context.journal.notifications.load(event.n).data.get("kind") == KIND:
            tidy_files(context.record.root, context.settings.days)
