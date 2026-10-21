import shlex
from dataclasses import dataclass

LEAD = ["journal", "worker", "dispatch"]
VALUED = ("--provider", "--profile", "--model", "--task")


@dataclass(frozen=True)
class DispatchLine:
    """A journal worker dispatch read off one part of a shell line: the brief it gives, the profile it names, and whether it asks for a fresh worker."""

    brief: str
    profile: str
    fresh: bool

    @classmethod
    def parsed(cls, text: str) -> "DispatchLine | None":
        try:
            tokens = shlex.split(text)
        except ValueError:
            return None
        if tokens[:3] != LEAD:
            return None
        positional, options, rest = [], {}, iter(tokens[3:])
        for token in rest:
            if token in VALUED:
                options[token] = next(rest, "")
            elif not token.startswith("--"):
                positional.append(token)
        return cls(brief=positional[1] if len(positional) > 1 else "", profile=options.get("--profile", ""), fresh="--fresh" in tokens)
