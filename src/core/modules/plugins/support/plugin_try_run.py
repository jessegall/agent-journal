from dataclasses import dataclass


@dataclass(frozen=True)
class PluginTryRun:
    """What trying a plugin's script gave: the line it was sent, its answer or its fault, and the newest skip on that
    key, if any."""

    line: str
    answer: str
    fault: str
    skip: str

    def text(self) -> str:
        ending = f"it failed: {self.fault}" if self.fault else f"exit code 0, answer: {self.answer or 'empty, which allows'}"
        skipped = f"\nthe newest skip on this key: {self.skip}" if self.skip else ""
        return f"this ran the script for real, and nothing it answered was applied\nline: {self.line}\n{ending}{skipped}"

    def values(self) -> dict[str, str]:
        return {"line": self.line, "answer": self.answer, "fault": self.fault, "skip": self.skip}
