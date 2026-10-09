from engine.events.engine import ClockTicked
from features.helper_worktrees.controller import Worktrees
from features.parts import WHOLE_FEATURE, AgentContext, Handler
from resources.base import SYSTEM


class ClearTakenWorktrees(Handler):
    behaviour = WHOLE_FEATURE

    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        Worktrees(context.record, actor=SYSTEM).clear_taken()
