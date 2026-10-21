from journal.features.feature import Feature
from journal.features.git.listeners.commit_detection import CommitDetection
from journal.features.git.listeners.worktree_session_link import WorktreeSessionLink
from journal.features.git.git_conduct import GitConduct
from journal.features.git.support.git_data_reader import GitDataReader
from journal.features.git.support.git_data import GitData


class Git(Feature[GitData]):
    """What the agent does in git, as the chat shows it: every commit is a badge, and a session in a worktree is marked with its branch."""

    name = "git"
    title = "Git"
    help = "Every commit the agent makes is a badge in the chat."
    listeners = (CommitDetection, WorktreeSessionLink)
    data = (GitDataReader,)
    conduct = (GitConduct,)
