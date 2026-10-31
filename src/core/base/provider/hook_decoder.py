from enum import StrEnum


class HookDecoder(StrEnum):
    """The Go decoders a program may name for its hook bodies: the fields every program shares, or Codex's own."""

    COMMON = "common"
    CODEX = "codex"
