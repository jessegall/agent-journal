from dataclasses import dataclass, field

from journal.features.mcp.support.known import Known


@dataclass(frozen=True)
class HealthReport:
    """What the agent program's check of its servers said: each server it knows, by name, or why the check itself failed."""

    servers: dict[str, Known] = field(default_factory=dict)
    failure: str | None = None
