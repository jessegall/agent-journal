from features.base import FeatureDetails, Line

OPEN = "open"


class PullRequestsDetails(FeatureDetails):
    name = "pull_requests"

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
