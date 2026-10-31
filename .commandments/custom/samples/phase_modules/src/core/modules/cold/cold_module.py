from core.base.module.module import Module


# @sin architecture_modules_ModuleSeedsDetector
# @sin architecture_modules_ModuleMovesDetector
class BareModule(Module):
    """A module that seeds no demo rows and carries no version 4 table, and says neither why."""

    name = "journal.core.bare"
    requires_core = ">=5,<6"
