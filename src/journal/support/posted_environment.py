from dataclasses import dataclass

from journal.support.rejection import Rejection

ENVIRONMENT_END = b"\0\0"


@dataclass(frozen=True)
class PostedEnvironment:
    """What a shim posts ahead of its payload: its shell's environment as env -0 writes it, ended by a double NUL, and the payload after it."""

    environment: dict[str, str]
    payload: bytes

    @classmethod
    def split(cls, raw: bytes, shape: str) -> "PostedEnvironment":
        pairs, separator, payload = raw.partition(ENVIRONMENT_END)
        if not separator:
            raise Rejection(f"{shape} is posted as the environment, a double NUL and {shape}")
        environment = dict(pair.decode(errors="replace").split("=", 1) for pair in pairs.split(b"\0") if b"=" in pair)
        return cls(environment, payload.lstrip(b"\0"))
