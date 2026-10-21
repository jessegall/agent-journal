from journal.features.faults.support.slow_requests import LOADS_PREFIX
from journal.http.journal.answer_time import AnswerTime
from journal.models.support.model_load import ModelLoad
from journal.models.timing import Timing
from journal.repositories.statistics import Statistics
from journal.repositories.timings import Timings
from journal.support.actor import Actor

PREFIX = "developer."
HOOKS_PREFIX = "developer.hooks."
LOG_ENTRIES = 100


class DeveloperNumbers:
    """What the Developer tab and journal developer read of how the journal answers: the average and slowest per kind, the newest and slowest requests from the rolling log, the newest requests with the rows they loaded, and the rows loaded per model since the last reset."""

    def __init__(self, statistics: Statistics, timings: Timings) -> None:
        self.statistics, self.timings = statistics, timings

    def hook_time(self) -> AnswerTime:
        return AnswerTime.read(self.statistics.lower(HOOKS_PREFIX), "developer.hooks")

    def request_time(self) -> AnswerTime:
        return AnswerTime.read(self.statistics.lower("developer.requests."), "developer.requests")

    def hook_averages(self) -> dict[str, AnswerTime]:
        numbers = self.statistics.lower(HOOKS_PREFIX)
        kinds = sorted({key.split(".")[2] for key in numbers if key.count(".") == 3})
        return {kind: AnswerTime.read(numbers, f"{HOOKS_PREFIX}{kind}") for kind in kinds}

    def recent(self) -> list[Timing]:
        return self.timings.recent(LOG_ENTRIES)

    def slowest(self) -> list[Timing]:
        return self.timings.slowest(LOG_ENTRIES)

    def loaded(self) -> list[Timing]:
        return [timing for timing in self.recent() if timing.loads.counts]

    def model_totals(self) -> list[ModelLoad]:
        totals = [ModelLoad(key.removeprefix(LOADS_PREFIX), rows) for key, rows in self.statistics.lower(LOADS_PREFIX).items()]
        return sorted(totals, key=lambda total: -total.rows)

    def reset(self, actor: Actor) -> None:
        self.statistics.cleared(PREFIX, actor)
        self.timings.cleared(actor)
