from features.base import FeatureDetails
from features.groups import Group


class GitActionsDetails(FeatureDetails):
    explains = 'The chat marks each git action the agent takes: switching branches, stashing, merging, rebasing, pushing and the rest, in plain words.'
    name = "git_actions"
    aliases = ("branch_switches",)
    group = Group.CHAT
    label = "Show git actions"
    has_skill = False

    title = "Git actions in the chat"

    abstract = "Whenever the agent runs a git action, the chat shows a mark saying what happened"

    help = """
        After every tool call the journal reads which branch the agent's own checkout is on, the main checkout
        or its worktree, straight from git's HEAD, so a switch by git switch, git checkout, an alias or a script is
        seen alike. When it changed, the chat shows a mark such as "worktree ticket-16 switched from main to
        custom-rule-checks"; a session that starts in a worktree gets one for the branch it starts on.

        Every git command in a shell call also gets a mark once it has run and not failed: "Stashed 3 changed files",
        "Rebased helper-x onto overnight-refactor", "Pushed main to origin". Stash, merge, rebase, cherry-pick, revert,
        reset, tag, push, pull, fetch, worktree add and remove, and branch create, rename and delete are marked;
        commits are marked on their own, and a command that only reads is not marked.
    """
