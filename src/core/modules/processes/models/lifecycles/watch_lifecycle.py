from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.modules.processes.models.enums.watch_state import WatchState


class WatchLifecycle(Lifecycle):
    states = WatchState
    initial = [WatchState.OPEN]
    editable = [WatchState.OPEN]
    deletable = tuple(WatchState)

    end = Move("end", [WatchState.OPEN], WatchState.ENDED)
