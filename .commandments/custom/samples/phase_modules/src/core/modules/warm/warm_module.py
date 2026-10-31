from core.base.module.module import Module


# @righteous architecture_modules_ModuleSeedsDetector
# @righteous architecture_modules_ModuleMovesDetector
# @sin architecture_core_OneClassPerFileDetector
class WarmModule(Module):
    """A module that seeds demo rows and carries its version 4 table."""

    name = "journal.core.warm"
    requires_core = ">=5,<6"
    seeders = [WarmSeeder]
    moves = [WarmMove]


# @righteous architecture_modules_ModuleSeedsDetector
# @righteous architecture_modules_ModuleMovesDetector
# @sin architecture_core_OneClassPerFileDetector
class ExplainedModule(Module):
    """A module that says why it seeds and moves nothing."""

    name = "journal.core.quiet"
    requires_core = ">=5,<6"
    seed_reason = "it adds no rows of its own to show"
    move_reason = "version 4 had no table for it"
