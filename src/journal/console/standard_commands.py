from journal.console.commands.environment_command import EnvironmentCommand
from journal.console.commands.setup_command import SetupCommand
from journal.console.commands.panic_command import PanicCommand


class StandardCommands:
    """The commands the journal ships with beside those its features bring."""

    COMMANDS = (SetupCommand, EnvironmentCommand, PanicCommand)
