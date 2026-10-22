from dataclasses import dataclass

from journal.support.posted_environment import PostedEnvironment


@dataclass(frozen=True)
class CliPost:
    """A journal command as the shim posts it: its shell's environment, then each word of the command ended by a NUL."""

    environment: dict[str, str]
    argv: list[str]

    @classmethod
    def parsed(cls, raw: bytes) -> "CliPost":
        body = PostedEnvironment.split(raw, "a command")
        arguments = body.payload.split(b"\0")
        return cls(body.environment, [argument.decode(errors="replace") for argument in (arguments[:-1] if arguments and not arguments[-1] else arguments)])
