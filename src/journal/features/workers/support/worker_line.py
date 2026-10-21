import shlex
from dataclasses import dataclass, field

LEAD = ["journal", "worker"]
VALUED = ("--provider", "--profile", "--model", "--task", "--why")


@dataclass(frozen=True)
class WorkerLine:
    """A journal worker command read off one part of a shell line: its verb, its arguments in order, its options with values, and its flags."""

    verb: str
    arguments: tuple[str, ...] = ()
    options: dict = field(default_factory=dict)
    flags: frozenset[str] = frozenset()

    @classmethod
    def parsed(cls, text: str) -> "WorkerLine | None":
        try:
            tokens = shlex.split(text)
        except ValueError:
            return None
        if tokens[:2] != LEAD or len(tokens) < 3:
            return None
        arguments, options, flags, rest = [], {}, set(), iter(tokens[3:])
        for token in rest:
            if token in VALUED:
                options[token] = next(rest, "")
            elif token.startswith("--"):
                flags.add(token)
            else:
                arguments.append(token)
        return cls(tokens[2], tuple(arguments), options, frozenset(flags))

    @property
    def brief(self) -> str:
        return self.arguments[1] if len(self.arguments) > 1 else ""

    @property
    def profile(self) -> str:
        return self.options.get("--profile", "")

    @property
    def fresh(self) -> bool:
        return "--fresh" in self.flags

    @property
    def number(self) -> int:
        return int(self.arguments[0]) if self.arguments and self.arguments[0].isdigit() else 0

    @property
    def why(self) -> str:
        return self.options.get("--why", "")
