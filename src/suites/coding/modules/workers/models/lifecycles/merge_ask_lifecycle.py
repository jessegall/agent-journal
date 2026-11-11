from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState


class MergeAskLifecycle(Lifecycle):
    """An ask for a merge waits until its work is merged or the merge sends it back."""

    states = MergeAskState
    initial = [MergeAskState.WAITING]
    editable = ()
    deletable = ()

    merge = Move("merge", [MergeAskState.WAITING], MergeAskState.MERGED)
    send_back = Move("send_back", [MergeAskState.WAITING], MergeAskState.RETURNED)
