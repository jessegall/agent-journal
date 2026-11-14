import shlex
from dataclasses import dataclass, fields



@dataclass(frozen=True)
class ReaderDraft:
    """A reader draft with the fields and matches found on one sample."""

    name: str
    commands: str
    title: str
    lines: str
    progress: str
    summary: str
    count: str
    count_command: str
    matches: tuple[str, ...]
    missing: tuple[str, ...] = ()
    script: str = ""
    step: str = ""
    finished: str = ""
    failed: str = ""
    topic: str = ""
    subject: str = ""

    @property
    def add_line(self) -> str:
        flags = (f"--{field.name.replace('_', '-')} {shlex.quote(value)}" for field in fields(self)
                 if field.name not in ("name", "matches", "missing") and isinstance(value := getattr(self, field.name), str) and value)
        return " ".join(("journal reader add", shlex.quote(self.name), *flags))
