import json
from collections.abc import Mapping
from dataclasses import dataclass

from suites.coding.modules.workers.models.worker_points import WorkerPoints
from suites.coding.modules.workers.support.brief_points import brief_points


@dataclass(frozen=True)
class WorkerPointList:
    """What the points window draws: each point of the worker's task brief with the proof shown for it, if
    any."""

    worker_points: WorkerPoints | None

    def json(self) -> Mapping[str, object]:
        return {"points": self.points()}

    def points(self) -> list[Mapping[str, object]]:
        if self.worker_points is None:
            return []
        proofs = {proof["point"]: proof for proof in json.loads(self.worker_points.proofs)}
        texts = brief_points(self.worker_points.task_brief, self.worker_points.task_title)
        return [{"id": number, "text": text, "proof": proofs.get(number)} for number, text in enumerate(texts, start=1)]
