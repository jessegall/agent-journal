from dataclasses import dataclass


@dataclass(frozen=True)
class WorkContextAttachment:
    """An attachment preview and the command that opens it in its authorized context."""

    name: str
    caption: str
    open_command: str
    caption_truncated: bool = False

    def lines(self) -> tuple[str, ...]:
        return (*(f"> {line}" for line in f"attachment: {self.name}".splitlines()),
                *(f"> {line}" for line in self.caption.splitlines()),
                *(f"  {line}" for line in self.open_command.splitlines()))
