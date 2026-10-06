from features.base import FeatureDetails, Line
from features.groups import Group

OPEN = "open"


class PullRequestsDetails(FeatureDetails):
    explains = 'The journal pins pull requests the agent opens above the chat. You can open one and follow its state.'
    name = "pull_requests"
    group = Group.CHAT
    label = "Pin open pull requests"
    has_skill = False

    title = "Pull requests"


    abstract = "A pull request the agent opens is pinned over the chat with its link until it is merged or closed"

    help = """
        When work goes through a pull request, open it with gh pr create and push the branch;
        the journal sees the pull request in what the command printed and pins it over the chat,
        with its link, so the user can open it at any time. Merging or closing it with gh pr merge
        or gh pr close takes the pin away, and the user can close it themselves.
    """

    lines = [
        Line(
            name=OPEN,
            title="Pull request {{number}} is open",
        ),
    ]
