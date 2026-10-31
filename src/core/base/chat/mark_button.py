from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class MarkButton:
    """A button beside a mark or on a docked item: its icon from the kit's icon set, its words, and the command line it
    runs, with {row_id} filled from the mark's row."""

    icon: str
    label: str
    runs: str

    def listed(self) -> dict[str, str]:
        return asdict(self)
