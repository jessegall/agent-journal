from argparse import ArgumentError, ArgumentParser, Namespace

from core.base.registry.registry import Registry


class WriteFlags:
    """The flags every subcommand that writes takes: --environment, --skip-guard (repeatable), the short flags
    modules grant for their own guards, --explain and --reason."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def add(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--skip-guard", action="append", default=[], dest="skip_guard")
        parser.add_argument("--skip-reason", default="", dest="skip_reason")
        parser.add_argument("--explain", action="store_true")
        self.add_reason(parser)
        for short_flag in dict.fromkeys(guard.short_flag for guard in self.registry.guards if guard.short_flag):
            parser.add_argument(f"--{short_flag}", action="store_true", dest=self.destination(short_flag))

    @staticmethod
    def add_reason(parser: ArgumentParser) -> None:
        """--reason says why an agent runs a line that asks a person; a command with a --reason of its own keeps it, and that text serves."""
        try:
            parser.add_argument("--reason", default="", help="why this is asked, shown to the person when the line needs their approval")
        except ArgumentError:
            return None

    def skipped_guards(self, arguments: Namespace) -> frozenset[str]:
        flag_guards: list[str] = list(arguments.skip_guard)
        short_flag_guards = [guard.name for guard in self.registry.guards if guard.short_flag and not guard.is_confirmation and getattr(arguments, self.destination(guard.short_flag))]
        return frozenset(flag_guards + short_flag_guards)

    def consume_short_flag(self, arguments: Namespace, short_flag: str) -> bool:
        destination = self.destination(short_flag)
        confirmed = bool(getattr(arguments, destination))
        setattr(arguments, destination, False)
        return confirmed

    def destination(self, short_flag: str) -> str:
        return "short_flag_" + short_flag.replace("-", "_")
