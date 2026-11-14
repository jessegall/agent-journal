from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window import Window
from suites.coding.support.skeletons import CODING_GIT_SKELETON
from suites.coding.windows.git.keys.branches_key import BranchesKey
from suites.coding.windows.git.keys.commits_key import CommitsKey
from suites.coding.windows.git.keys.pulls_key import PullsKey


class GitWindow(Window):
    """The project's branches, commits and pull requests."""

    name = "coding.git"
    title = "Git"
    entry = "git.js"
    loading = WindowLoading.COMPONENT
    skeleton = CODING_GIT_SKELETON
    place = WindowPlace.PAGE
    group = "project"
    icon = WindowIcon.BRANCH
    keys = [BranchesKey, CommitsKey, PullsKey]
