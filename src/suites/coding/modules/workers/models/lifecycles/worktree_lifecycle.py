from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState


class WorktreeLifecycle(Lifecycle):
    states = WorktreeState
    initial = [WorktreeState.NEW]
    editable = ()
    deletable = [WorktreeState.NEW]

    cut = Move("cut", [WorktreeState.NEW], WorktreeState.CUT)
    advance = Move("advance", [WorktreeState.CUT], WorktreeState.CUT)
    deliver = Move("deliver", [WorktreeState.CUT], WorktreeState.DELIVERED)
    rework = Move("rework", [WorktreeState.DELIVERED], WorktreeState.CUT)
    review_logs = Move("review_logs", [WorktreeState.DELIVERED], WorktreeState.DELIVERED)
    return_worker = Move("return_worker", [WorktreeState.DELIVERED], WorktreeState.DELIVERED)
    mark_tests_passed = Move("mark_tests_passed", [WorktreeState.DELIVERED], WorktreeState.DELIVERED)
    merge = Move("merge", [WorktreeState.DELIVERED], WorktreeState.MERGED)
    change_cut_libraries = Move("change_cut_libraries", [WorktreeState.CUT], WorktreeState.CUT)
    change_delivered_libraries = Move("change_delivered_libraries", [WorktreeState.DELIVERED], WorktreeState.DELIVERED)
    fail = Move("fail", [WorktreeState.CUT], WorktreeState.FAILED)
    abandon = Move("abandon", (WorktreeState.CUT, WorktreeState.DELIVERED), WorktreeState.ABANDONED)
    remove = Move("remove", (WorktreeState.MERGED, WorktreeState.ABANDONED), WorktreeState.REMOVED)
