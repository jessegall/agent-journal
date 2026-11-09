from core.base.module.model_declaration import ModelDeclaration
from core.modules.usage.models.agent_listing import AgentListing
from core.modules.usage.models.agent_counts import AgentCounts
from core.modules.usage.models.agent_filter_options_view import AgentFilterOptionsView
from core.modules.usage.commands.agent_cards.agent_cards_subcommand import AgentCardsSubcommand
from core.modules.usage.commands.agent_tip.agent_tip_subcommand import AgentTipSubcommand
from core.modules.usage.commands.agent_limits.agent_limits_subcommand import AgentLimitsSubcommand
from core.modules.usage.commands.set_profile_limits.set_profile_limits_handler import SetProfileLimitsHandler
from core.modules.usage.commands.set_profile_limits.set_profile_limits_subcommand import SetProfileLimitsSubcommand
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.base.viewer.window_shows import WindowShows
from core.modules.usage.commands.usage_agents.usage_agents_subcommand import UsageAgentsSubcommand
from core.modules.usage.commands.statistic_list.statistic_list_subcommand import StatisticListSubcommand
from core.modules.usage.commands.usage_bars.usage_bars_subcommand import UsageBarsSubcommand
from core.modules.usage.commands.usage_show.usage_show_subcommand import UsageShowSubcommand
from core.modules.usage.commands.usage_fitness.usage_fitness_subcommand import UsageFitnessSubcommand
from core.modules.usage.commands.usage_own_messages.usage_own_messages_subcommand import UsageOwnMessagesSubcommand
from core.modules.usage.commands.usage_tool.usage_tool_subcommand import UsageToolSubcommand
from core.modules.usage.commands.usage_agent.usage_agent_subcommand import UsageAgentSubcommand
from core.modules.usage.commands.usage_inspector.usage_inspector_subcommand import UsageInspectorSubcommand
from core.modules.usage.listeners.ended_agent_status_listener import EndedAgentStatusListener
from core.modules.usage.migrations.m001_statistics import StatisticsTableMigration
from core.modules.usage.models.agent_card import AgentCard
from core.modules.usage.models.statistic import Statistic
from core.modules.usage.upgrade.statistics_move import StatisticsMove
from core.modules.usage.support.skeletons import USAGE_USAGE_SKELETON, USAGE_COST_SKELETON, USAGE_FITNESS_SKELETON, USAGE_MACHINE_SKELETON, USAGE_CONTEXT_SKELETON


class UsageModule(Module):
    """Adds usage and cost: what each open session's status line reported of its model, context and cost, the
    plan's windows, and the project's counts, shown on the Usage window."""

    name = "journal.core.usage"
    seed_reason = "usage is what the agent programs report, which a demo has none of"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.environments", "journal.core.tasks", "journal.core.questions", "journal.core.drivers", "journal.core.messages", "journal.core.waits", "journal.core.plans", "journal.core.processes", "journal.core.settings", "journal.core.actors", "journal.core.schedules", "journal.core.skills"]
    models = [ModelDeclaration(Statistic, excluded_subcommands=["make", "edit", "show", "list", "delete"])]
    migrations = [StatisticsTableMigration]
    views = [AgentCard, AgentListing, AgentFilterOptionsView, AgentCounts]
    listeners = [EndedAgentStatusListener]
    moves = [StatisticsMove]
    handlers = [SetProfileLimitsHandler]
    subcommands = [AgentLimitsSubcommand, SetProfileLimitsSubcommand, AgentCardsSubcommand, AgentTipSubcommand, UsageAgentsSubcommand, UsageFitnessSubcommand, UsageShowSubcommand, UsageBarsSubcommand, UsageToolSubcommand, UsageOwnMessagesSubcommand, UsageAgentSubcommand, UsageInspectorSubcommand, StatisticListSubcommand]
    windows = [WindowDeclaration("usage.usage", "Usage", "usage.js", WindowLoading.COMPONENT, skeleton=USAGE_USAGE_SKELETON, icon=WindowIcon.FITNESS, place=WindowPlace.DROPDOWN, reads=["usage show", "usage-limit list"], runs=["usage-limit set", "usage-limit delete"], events=["usage_limit.*"], keys=[WindowKey("usage", "usage show", reload_seconds=30), WindowKey("limits", "usage-limit list", events=["usage_limit.*"])]),
               WindowDeclaration("usage.cost", "Cost", "cost.js", WindowLoading.COMPONENT, skeleton=USAGE_COST_SKELETON, icon=WindowIcon.FITNESS, place=WindowPlace.DROPDOWN, reads=["usage show"], keys=[WindowKey("usage", "usage show", reload_seconds=30)]),
               WindowDeclaration("usage.fitness", "Fitness", "fitness.js", WindowLoading.COMPONENT, skeleton=USAGE_FITNESS_SKELETON, icon=WindowIcon.FITNESS, place=WindowPlace.DROPDOWN, shows=WindowShows.SELECTED_AGENT, reads=["usage fitness"], keys=[WindowKey("fitness", "usage fitness", arguments=["agent"])]),
               WindowDeclaration("usage.load", "Load", "load.js", WindowLoading.COMPONENT, skeleton=USAGE_MACHINE_SKELETON, icon=WindowIcon.FITNESS, place=WindowPlace.DROPDOWN, shows=WindowShows.SELECTED_AGENT, reads=["usage fitness"], keys=[WindowKey("fitness", "usage fitness", arguments=["agent"])]),
               WindowDeclaration("usage.context", "Context", "context.js", WindowLoading.COMPONENT, skeleton=USAGE_CONTEXT_SKELETON, icon=WindowIcon.FITNESS, place=WindowPlace.DROPDOWN, reads=["usage show"], keys=[WindowKey("usage", "usage show", reload_seconds=30)])]
