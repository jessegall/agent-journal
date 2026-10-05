from features.base import FeatureDetails, Line
from features.groups import Group


class CloseFromCommitsDetails(FeatureDetails):
    name = "close_from_commits"
    group = Group.WORK_TRACKING
    label = "Close to-dos from commit messages"
    hint = "Journal: todos done 648"
    has_skill = False

    title = "Close to-dos from commits"

    aliases = ("commits",)


    abstract = "A commit whose message carries Journal: todos done and a to-do number closes that row"

    help = "The trailer starts at column 0; prose and indented examples close nothing. Every commit shows in the chat as a mark with its hash, branch and subject."

    lines = [
        Line(
            name="closed",
            title="commit {{sha}} closed {{rows}}{{ended}}",
            brief="The rows and the work are done; take the next one.",
        ),
    ]
