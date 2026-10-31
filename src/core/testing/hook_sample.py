from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class HookSample:
    """One prepared hook object a story sends, as the Go program writes it, with fields a story may set anew."""

    body: Mapping[str, object]

    @property
    def firing(self) -> object:
        return self.body["firing"]

    def with_fields(self, **fields: object) -> "HookSample":
        return HookSample({**self.body, **fields})
