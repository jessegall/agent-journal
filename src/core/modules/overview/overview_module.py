from engine.module.module import Module
from core.modules.overview.lines.overview_first_lines import OverviewFirstLines
from core.modules.overview.needs.overview_first_needs import OverviewFirstNeeds
from core.modules.overview.commands.overview.overview_subcommand import OverviewSubcommand
from core.modules.overview.support.block_conditions.recent_overview_read import RecentOverviewRead
from core.modules.overview.support.overview_agent_messages import OVERVIEW_AGENT_MESSAGES
from core.modules.overview.support.overview_settings import OVERVIEW_SETTINGS


class OverviewModule(Module):
    """Adds journal overview, a page of what is open or running that shows the commands the user chooses, and which
    an agent must run first when its session starts or is compacted."""

    name = "journal.core.overview"
    seed_reason = "it keeps no rows"
    move_reason = "version 4 kept no rows for its overview that version 5 needs"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.settings", "journal.core.drivers"]
    agent_messages = OVERVIEW_AGENT_MESSAGES
    settings = OVERVIEW_SETTINGS
    subcommands = [OverviewSubcommand]
    block_conditions = [RecentOverviewRead]
    needs = [OverviewFirstNeeds]
    lines = [OverviewFirstLines]
