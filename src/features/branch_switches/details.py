from features.base import FeatureDetails
from features.groups import Group


class BranchSwitchesDetails(FeatureDetails):
    name = "branch_switches"
    group = Group.CHAT
    label = "Show branch switches"
    has_skill = False

    title = "Branch switches in the chat"

    abstract = "Whenever the agent's checkout changes branch, the chat shows a mark naming the checkout and the branches"

    help = """
        After every tool call the journal reads which branch the agent's own checkout is on, the main checkout
        or its worktree, straight from git's HEAD, so a switch by git switch, git checkout, an alias or a script is
        seen alike. When it changed, the chat shows a mark such as "worktree ticket-16 switched from main to
        custom-rule-checks"; a session that starts in a worktree gets one for the branch it starts on.
    """
