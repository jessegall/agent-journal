from journal.console.command import Command
from journal.console.commands.environment_command import EnvironmentCommand
from journal.console.commands.setup_command import SetupCommand
from journal.console.commands.nudge_command import NudgeCommand
from journal.console.commands.panic_command import PanicCommand
from journal.console.commands.settings_command import SettingsCommand


class StandardCommands:
    """The commands the journal ships with beside those its features bring."""

    COMMANDS: tuple[type[Command], ...] = (SetupCommand, EnvironmentCommand, PanicCommand, NudgeCommand, SettingsCommand)
