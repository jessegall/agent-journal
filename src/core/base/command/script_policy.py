from dataclasses import dataclass

DELIVERY_LIMIT_MS = 60_000


@dataclass(frozen=True)
class ScriptPolicy:
    """Whether commands of this container may run guard and listen scripts, and the limit on a commit script. The
    default is closed, for every container nobody binds: a server round, a tick and a direct run. Only a request in a
    server opens it, since a hung script there stops nothing but its own caller."""

    guards_run: bool = False
    commit_limit_ms: int | None = DELIVERY_LIMIT_MS
