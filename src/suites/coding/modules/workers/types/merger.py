from core.modules.helpers.types.helper_commands import HelperCommands
from suites.coding.modules.workers.types.merger_commands import MergerCommands
from core.modules.helpers.types.helper import Helper


class Merger(Helper):
    """The merger: it takes finished worktrees into the base branch and settles what holds a worker. It
    reads, as every helper does, and takes the rest of its fields from the helper."""

    key = "merger"
    label = "Merger"
    default_profile = "journal-merger"
    commands = HelperCommands().joined(MergerCommands())
