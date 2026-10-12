from events.boards import BoardStarted
from features.work_modes.details import ORCHESTRATOR
from features.work_modes.modes import pick
from framework.parts import Context, Handler


class OrchestrateWhenABoardStarts(Handler):
    def handle(self, context: Context, event: BoardStarted) -> None:
        pick(context.record, ORCHESTRATOR, event.actor)
