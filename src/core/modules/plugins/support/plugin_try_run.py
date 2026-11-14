from dataclasses import dataclass


@dataclass(frozen=True)
class PluginTryRun:
    """What trying a plugin's script gave: the line it was sent, its answer or its fault, and the newest skip on that
    key, if any."""

    line: str
    skip: str | None
    answer: str | None = None
    fault: str | None = None

    def text(self) -> str:
        ending = f"it failed: {self.fault}" if self.fault is not None else f"exit code 0, answer: {self.answer or 'empty, which allows'}"
        skipped = f"\nthe newest skip on this key: {self.skip}" if self.skip is not None else ""
        return f"this ran the script for real, and nothing it answered was applied\nline: {self.line}\n{ending}{skipped}"

    def values(self) -> dict[str, str | None]:
        return {"line": self.line, "answer": self.answer, "fault": self.fault, "skip": self.skip}
