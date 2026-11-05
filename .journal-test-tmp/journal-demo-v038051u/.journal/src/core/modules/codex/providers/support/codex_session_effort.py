from os import SEEK_END
from pathlib import Path

from core.base.provider.transcript_tail import TAIL_BYTES
from core.modules.codex.providers.support.codex_turn_effort import CodexTurnEffort


class CodexSessionEffort:
    """Reads backward through complete rollout records until the latest turn's effort is found, or with
    `field="model"` its model."""

    def __init__(self, path: Path, field: str = "effort") -> None:
        self.path, self.field = path, field

    def read(self) -> str:
        if not self.path.is_file():
            return ""
        with self.path.open("rb") as transcript:
            position = transcript.seek(0, SEEK_END)
            remainder = b""
            incomplete = True
            while position:
                size = min(position, TAIL_BYTES)
                position -= size
                transcript.seek(position)
                lines = (transcript.read(size) + remainder).split(b"\n")
                remainder = lines.pop(0)
                if incomplete:
                    if not lines:
                        remainder = b""
                        continue
                    lines.pop()
                    incomplete = False
                for line in reversed(lines):
                    value = CodexTurnEffort.parsed(line.decode(), self.field)
                    if value:
                        return value
        return "" if incomplete else CodexTurnEffort.parsed(remainder.decode(), self.field)
