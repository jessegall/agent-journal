from journal.console.commands.environment_command import EnvironmentCommand
from journal.console.commands.setup_command import SetupCommand


class StandardCommands:
    """The commands the journal ships with beside those its features bring."""

    COMMANDS = (SetupCommand, EnvironmentCommand)
