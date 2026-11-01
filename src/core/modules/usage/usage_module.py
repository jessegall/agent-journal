from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.usage.commands.statistic_list.statistic_list_subcommand import StatisticListSubcommand
from core.modules.usage.commands.usage_bars.usage_bars_subcommand import UsageBarsSubcommand
from core.modules.usage.commands.usage_show.usage_show_subcommand import UsageShowSubcommand
from core.modules.usage.commands.usage_tool.usage_tool_subcommand import UsageToolSubcommand
from core.modules.usage.migrations.m001_statistics import StatisticsTableMigration
from core.modules.usage.models.statistic import Statistic
from core.modules.usage.upgrade.statistics_move import StatisticsMove


class UsageModule(Module):
    """Adds usage and cost: what each open session's status line reported of its model, context and cost, the plan's
    windows, and the project's counts, shown on the Usage window."""

    name = "journal.core.usage"
    seed_reason = "usage is what the agent programs report, which a demo has none of"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.core.environments", "journal.core.tasks", "journal.core.questions", "journal.core.drivers"]
    models = [ModelDeclaration(Statistic, excluded_subcommands=["make", "edit", "show", "list", "delete"])]
    migrations = [StatisticsTableMigration]
    moves = [StatisticsMove]
    subcommands = (UsageShowSubcommand, UsageBarsSubcommand, UsageToolSubcommand, StatisticListSubcommand)
    windows = [WindowDeclaration("usage.usage", "Usage", "usage.js", WindowLoading.COMPONENT, icon=WindowIcon.FITNESS, place=WindowPlace.DROPDOWN, reads=["usage show"]),
               WindowDeclaration("usage.context", "Context", "context.js", WindowLoading.COMPONENT, icon=WindowIcon.FITNESS, place=WindowPlace.DROPDOWN, reads=["usage show"])]
