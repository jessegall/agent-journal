from engine.database.repeated_finding import RepeatedFinding
from engine.database.repeated_work import RepeatedWork


class CollectingRepeatedWork(RepeatedWork):
    """Collects what a request repeats and raises nothing, so the user's action still finishes."""

    def reject(self, finding: RepeatedFinding) -> None:
        self.findings.append(finding)

    def finish(self) -> None:
        return
