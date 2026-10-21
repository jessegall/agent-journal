from journal.features.aliases.commands.alias_command import AliasCommand
from journal.features.feature import Feature


class AliasesFeature(Feature):
    name = "aliases"
    title = "Aliases"
    help = "A name for a command line of the project: journal <name> runs it with the arguments passed on, recorded as the agent's own command and watched through its reader when it moves to the background; plugins ship theirs."
    commands = (AliasCommand,)
