from core.base.module.module import Module
from core.modules.overview.commands.overview.overview_subcommand import OverviewSubcommand
from core.modules.overview.overlays.overview_overlay import OverviewOverlay
from core.modules.overview.rules.overview_compaction_rule import OverviewCompactionRule
from core.modules.overview.rules.overview_first_rule import OverviewFirstRule
from core.modules.overview.support.overview_nudges import OVERVIEW_NUDGES
from core.modules.overview.support.overview_settings import OVERVIEW_SETTINGS


class OverviewModule(Module):
    """Adds journal overview, a page of what is open or running that shows the commands the user chooses, and which
    an agent must run first when its session starts or is compacted."""

    name = "journal.core.overview"
    seed_reason = "it keeps no rows"
    move_reason = "version 4 kept no rows for its overview that version 5 needs"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.settings", "journal.core.drivers"]
    nudges = OVERVIEW_NUDGES
    driver_rules = [OverviewFirstRule, OverviewCompactionRule]
    overlays = [OverviewOverlay]
    settings = OVERVIEW_SETTINGS
    subcommands = [OverviewSubcommand]
