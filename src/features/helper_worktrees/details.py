from engine.reach import Reach
from features.base import FeatureDetails, Line
from features.groups import Group


class HelperWorktreesDetails(FeatureDetails):
    explains = 'The journal gives each helper a separate working copy of the project. You can inspect and take its work when it finishes.'
    name = "helper_worktrees"
    group = Group.SESSIONS
    label = "Give each helper its own worktree"
    skill_of = "todos"
    when = "a helper is given a worktree of its own, or its work is taken back"

    title = "Helper worktrees"

    abstract = """
        Each helper works in its own git worktree, made from the latest commit of the working
        branch. Its commits are copied back once it has rebased.
    """

    help = """
        A helper that changes code gets its worktree through journal worktree cut "<name>"
        [--helper <name>]: it is cut from the current tip of the branch the main checkout is on,
        and prints the path and branch to put in the dispatch prompt. journal worktree drift <n>
        says what the working branch gained since; the helper is told once for each new tip to
        rebase. Once it has rebased onto the working branch, journal worktree take <n>
        cherry-picks its commits onto it, and journal worktree drop <n> removes the worktree and
        its branch.

        The main agent stays in its own checkout: while its working folder sits in another one,
        every tool call is refused until it goes back with cd, since a compaction there would
        move it into that checkout's environment. git -C <folder> or a subshell works in another
        checkout without moving.
    """

    lines = [
        Line(
            name="drifted",
            title="{{working}} moved {{commits}} since your worktree was cut: rebase onto {{working}} in {{path}} before you report.",
            reach=Reach.BOTH,
        ),
        Line(
            name="strayed",
            title="Your working folder {{folder}} is another checkout than your own, and a new start there would move you into "
                  "another environment. Go back with cd {{home}} first; work in another checkout with git -C <folder> or a "
                  "subshell, ( cd <folder> && … ).",
        ),
    ]
