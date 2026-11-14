from engine.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.tasks.models.environment_card import EnvironmentCard


class EnvironmentCardsSubcommand(ViewRowsSubcommand):
    """`journal environment cards`: each environment with its running agents and its unfinished tasks."""

    model = EnvironmentCard
    cli_name = "environment"
    name = "cards"
