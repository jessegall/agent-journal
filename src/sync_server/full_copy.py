from dataclasses import dataclass

from sync_server.copied_row import CopiedRow


@dataclass(frozen=True)
class FullCopy:
    """Every row of the team's journal for a joining machine, and the sequence it holds them at, which its first pull starts from."""

    rows: tuple[CopiedRow, ...]
    head: int
    server_time: float
