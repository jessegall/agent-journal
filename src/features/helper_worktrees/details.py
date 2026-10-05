from engine.reach import Reach
from features.base import FeatureDetails, Line
from features.groups import Group


class HelperWorktreesDetails(FeatureDetails):
    name = "helper_worktrees"
    group = Group.SESSIONS
    label = "Give each helper its own worktree"
    skill_of = "todos"
    when = "a helper is given a worktree of its own, or its work is taken back"

    title = "Helper worktrees"

    abstract = """
        Helpers work in worktrees cut from the tip of the working branch, and their commits come
        back by cherry-pick once they have rebased
    """

    help = """
        A helper that changes code gets its worktree through journal worktree cut "<name>"
        [--helper <name>]: it is cut from the current tip of the branch the main checkout is on,
        and prints the path and branch to put in the dispatch prompt. journal worktree drift <n>
        says what the working branch gained since; the helper is told once for each new tip to
        rebase. Once it has rebased onto the working branch, journal worktree take <n>
        cherry-picks its commits onto it, and journal worktree drop <n> removes the worktree and
        its branch.
    """

    lines = [
        Line(
            name="drifted",
            title="{{working}} moved {{commits}} since your worktree was cut: rebase onto {{working}} in {{path}} before you report. "
                  "This one call was held back to tell you; run it again after.",
            reach=Reach.BOTH,
        ),
    ]
