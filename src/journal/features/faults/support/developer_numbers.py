from journal.features.faults.support.developer_tally import DeveloperTally
from journal.http.journal.answer_time import AnswerTime
from journal.models.support.model_load import ModelLoad
from journal.models.timing import Timing
from journal.repositories.statistics import Statistics
from journal.repositories.timings import Timings
from journal.support.actor import Actor

PREFIX = "developer."
HOOKS_PREFIX = "developer.hooks."
LOADS_PREFIX = "developer.loads."
LOG_ENTRIES = 100


class DeveloperNumbers:
    """What the Developer tab and the journal developer command read of how the journal answers: the average and slowest per kind, the newest and slowest requests from the rolling log, the newest requests with the rows they loaded, and the rows loaded per model since the last reset."""

    def __init__(self, statistics: Statistics, timings: Timings, tally: DeveloperTally) -> None:
        self.statistics, self.timings, self.tally = statistics, timings, tally

    def series(self, prefix: str) -> dict[str, int]:
        self.tally.write()
        return self.statistics.lower(prefix)

    def log(self) -> Timings:
        self.tally.write()
        return self.timings

    def hook_time(self) -> AnswerTime:
        return AnswerTime.read(self.series(HOOKS_PREFIX), "developer.hooks")

    def request_time(self) -> AnswerTime:
        return AnswerTime.read(self.series("developer.requests."), "developer.requests")

    def hook_averages(self) -> dict[str, AnswerTime]:
        numbers = self.series(HOOKS_PREFIX)
        kinds = sorted({key.split(".")[2] for key in numbers if key.count(".") == 3})
        return {kind: AnswerTime.read(numbers, f"{HOOKS_PREFIX}{kind}") for kind in kinds}

    def recent(self) -> list[Timing]:
        return self.log().recent(LOG_ENTRIES)

    def slowest(self, limit: int = LOG_ENTRIES) -> list[Timing]:
        return self.log().slowest(limit)

    def slowest_hooks(self, limit: int) -> list[Timing]:
        return self.log().slowest_hooks(limit)

    def slowest_requests(self, limit: int) -> list[Timing]:
        return self.log().slowest_requests(limit)

    def loaded(self) -> list[Timing]:
        return [timing for timing in self.recent() if timing.loads.counts]

    def model_totals(self) -> list[ModelLoad]:
        totals = [ModelLoad(key.removeprefix(LOADS_PREFIX), rows) for key, rows in self.series(LOADS_PREFIX).items()]
        return sorted(totals, key=lambda total: -total.rows)

    def reset(self, actor: Actor) -> None:
        self.tally.write()
        self.statistics.cleared(PREFIX, actor)
        self.timings.cleared(actor)
