from journal.features.feature import Feature
from journal.features.git.listeners.spot_commit import SpotCommit


class Git(Feature):
    """What the agent does in git, as the chat shows it: every commit is a badge."""

    name = "git"
    title = "Git"
    help = "Every commit the agent makes is a badge in the chat."
    listeners = (SpotCommit,)
