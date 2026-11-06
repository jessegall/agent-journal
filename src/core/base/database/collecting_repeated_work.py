from core.base.database.repeated_work import RepeatedWork


class CollectingRepeatedWork(RepeatedWork):
    """Collects what a request repeats and raises nothing, so the person's action still finishes."""

    def reject(self, finding: str) -> None:
        self.findings.append(finding)

    def conclude(self) -> None:
        return
