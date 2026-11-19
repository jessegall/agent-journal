from collections.abc import Sequence

ARGUMENTS_END = "--"
# the journal's own flags of a saved command, which say what is read of its output or how long it may run, each with
# its value; they come before a bare --, and never reach the command
VALUED_FLAGS = frozenset({"--tail", "--head", "--cut", "--timeout"})
BARE_FLAGS = frozenset({"--allow-large-read"})


class SavedCommandArguments:
    """The arguments a saved command itself receives, as the hook gives them: the journal's own flags before a bare --
    are taken out, and with them the --, so a line run without the server passes the same arguments."""

    @staticmethod
    def command_arguments(arguments: Sequence[str]) -> list[str]:
        place = list(arguments).index(ARGUMENTS_END) if ARGUMENTS_END in arguments else len(arguments)
        flags, remainder = list(arguments[:place]), list(arguments[place + 1:])
        kept: list[str] = []
        removed = False
        position = 0
        while position < len(flags):
            flag = flags[position]
            name = flag.split("=", 1)[0]
            if name in VALUED_FLAGS:
                removed = True
                position += 1 if "=" in flag else 2
                continue
            if flag in BARE_FLAGS:
                removed = True
                position += 1
                continue
            kept.append(flag)
            position += 1
        return [*kept, *remainder] if removed else list(arguments)
