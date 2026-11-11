from suites.coding.modules.workers.support.work_unit import WorkUnit

UNIT_RETURN_TEXT = "Your merge was sent back: {reason}. Your worktree is open again. Now: fix it, commit, and ask for the merge again with journal worker ask-merge."
SINGLE_RETURN_TEXT = "Your merge was sent back: {reason}. Fix it in your worktree and commit again."


def merge_return_line(reason: str, unit: WorkUnit) -> str:
    return (UNIT_RETURN_TEXT if unit.has_several_tasks else SINGLE_RETURN_TEXT).format(reason=reason)
