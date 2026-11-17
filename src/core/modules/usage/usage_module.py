from core.modules.usage.declarations.usage_dependencies import USAGE_DEPENDENCIES
from core.modules.usage.declarations.usage_subcommands import USAGE_SUBCOMMANDS
from core.modules.usage.windows.usage_windows import USAGE_WINDOWS
from core.modules.usage.models.declarations.statistic_model_declaration import StatisticModelDeclaration
from core.modules.usage.models.agent_listing import AgentListing
from core.modules.usage.models.agent_counts import AgentCounts
from core.modules.usage.models.agent_filter_options_view import AgentFilterOptionsView
from core.modules.usage.commands.set_profile_limits.set_profile_limits_handler import SetProfileLimitsHandler
from engine.module.module import Module
from core.modules.usage.listeners.ended_agent_status_listener import EndedAgentStatusListener
from core.modules.usage.migrations.m001_statistics import StatisticsTableMigration
from core.modules.usage.models.agent_card import AgentCard
from core.modules.usage.upgrade.statistics_move import StatisticsMove


from core.modules.usage.commands.count_profile_use.count_profile_use_handler import CountProfileUseHandler

class UsageModule(Module):
    """Adds usage and cost: what each open session's status line reported of its model, context and cost, the
    plan's windows, and the project's counts, shown on the Usage window."""

    name = "journal.core.usage"
    seed_reason = "usage is what the agent programs report, which a demo has none of"
    requires_engine = ">=7,<8"
    dependencies = USAGE_DEPENDENCIES
    models = [StatisticModelDeclaration]
    migrations = [StatisticsTableMigration]
    views = [AgentCard, AgentListing, AgentFilterOptionsView, AgentCounts]
    listeners = [EndedAgentStatusListener]
    moves = [StatisticsMove]
    handlers = [CountProfileUseHandler, SetProfileLimitsHandler]
    subcommands = USAGE_SUBCOMMANDS
    windows = USAGE_WINDOWS
