from engine.viewer.window_extension import WindowExtension
from suites.coding.windows.extensions.keys.branch_key import BranchKey


class ShellBranchExtension(WindowExtension):
    """The branch of the project's checkout, shown in the viewer's shell."""

    window = "viewer.shell"
    reads = ["git-overview current"]
    keys = [BranchKey]
