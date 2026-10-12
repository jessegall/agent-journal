
from engine import runtime
from engine.locks import project_sweep

from events.agents import ClockTicked
from features.runtime_cleanup.tidy import tidy, tidy_files
from framework.parts import WHOLE_FEATURE, AgentContext, Context, Handler
from features.auto_update.announcing import KIND
from controllers.types import Notifications
from events.notifications import NotificationCreated

TIDYING = "tidying.lock"
ONCE_EVERY = 50 * 60


class TidyRuntime(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        root = context.record.root
        with project_sweep(runtime.folder(root) / TIDYING, ONCE_EVERY) as mine:
            if mine:
                tidy(root, context.settings.days)


class TidyAfterUpdate(Handler):
    def handle(self, context: Context, event: NotificationCreated) -> None:
        if context.journal.get(Notifications).load(event.n).data.get("kind") == KIND:
            tidy_files(context.record.root, context.settings.days)
