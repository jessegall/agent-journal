from engine.cli.view_rows_subcommand import ViewRowsSubcommand
from core.modules.aliases.models.saved_command import SavedCommand


class AliasSavedSubcommand(ViewRowsSubcommand):
    """Lists the saved test and build commands."""

    model = SavedCommand
    cli_name = "alias"
    name = "saved"
    outward = True
