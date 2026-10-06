from features.base import FeatureDetails, Line
from features.groups import Group


class CloseFromCommitsDetails(FeatureDetails):
    explains = 'The journal closes a to-do when a matching commit says it is done. You can inspect the to-do and its closing commit.'
    name = "close_from_commits"
    group = Group.WORK_TRACKING
    label = "Close to-dos from commit messages"
    hint = "A commit message with “Journal: todos done 648” closes to-do 648"
    has_skill = False

    title = "Close to-dos from commits"

    aliases = ("commits",)


    abstract = "A commit whose message carries Journal: todos done and a to-do number closes that to-do"

    help = "Put the line on its own line in the commit message; indented examples and text inside a sentence are ignored. Every commit shows in the chat as a mark with its hash, branch and subject."

    lines = [
        Line(
            name="closed",
            title="commit {{sha}} closed {{rows}}{{ended}}",
            brief="The rows and the work are done; take the next one.",
        ),
    ]
