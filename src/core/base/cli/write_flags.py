from argparse import ArgumentParser, Namespace

from core.base.registry.registry import Registry


class WriteFlags:
    """The flags every subcommand that writes takes: --environment, --skip-guard (repeatable), the short flags
    modules grant for their own guards, and --explain."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def add(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment")
        parser.add_argument("--skip-guard", action="append", default=[], dest="skip_guard")
        parser.add_argument("--explain", action="store_true")
        for guard in self.registry.guards:
            if guard.short_flag:
                parser.add_argument(f"--{guard.short_flag}", action="store_true", dest=self.destination(guard.short_flag))

    def skipped_guards(self, arguments: Namespace) -> frozenset[str]:
        flag_guards: list[str] = list(arguments.skip_guard)
        short_flag_guards = [guard.name for guard in self.registry.guards if guard.short_flag and getattr(arguments, self.destination(guard.short_flag))]
        return frozenset(flag_guards + short_flag_guards)

    def destination(self, short_flag: str) -> str:
        return "short_flag_" + short_flag.replace("-", "_")
