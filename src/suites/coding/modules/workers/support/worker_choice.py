from dataclasses import dataclass
from suites.coding.modules.workers.support.worker_route_fallback import WorkerRouteFallback


@dataclass(frozen=True)
class WorkerChoice:
    """The program and model selected for a worker, with the reason."""

    program: str
    model: str
    reason: str

    fallback: WorkerRouteFallback | None = None
