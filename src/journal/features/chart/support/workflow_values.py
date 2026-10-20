from journal.models.chart import Chart
from journal.repositories.counts import Counts
from journal.repositories.noted_times import NotedTimes
from journal.support.actor import Actor


class WorkflowValues:
    """The counts and times a workflow keeps, in every environment: what ends them when the workflow is deleted, reset, or no longer names them."""

    def __init__(self, counts: Counts, times: NotedTimes) -> None:
        self.counts, self.times = counts, times

    def forget(self, chart: Chart, by: Actor) -> None:
        self.forget_unnamed(chart, set(), by)

    def forget_unnamed(self, chart: Chart, named: set[str], by: Actor) -> list[tuple[str, int]]:
        """The values no node of the workflow names any more, gone; each by its name and environment."""
        prefix = f"charts:{chart.id}:"
        counts = [c for c in self.counts.everywhere_of_workflow(chart.id) if c.name[len(prefix):] not in named]
        times = [t for t in self.times.everywhere_of_workflow(chart.id) if t.name[len(prefix):] not in named]
        for count in counts:
            self.counts.delete(count, by)
        for time in times:
            self.times.delete(time, by)
        return sorted({(row.name[len(prefix):], row.environment_id) for row in (*counts, *times)})
