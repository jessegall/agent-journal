from collections.abc import Callable

from engine.command.context import Context
from core.base.driver.count_down import CountDown
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.countdown import Countdown


def condition_unmet() -> bool:
    return False


class Countdowns:
    """The one place a counted thing is counted, for any actor: each tick is kept in a row, so a count survives
    the separate command lines it is made over. A new subject starts the count again and a given condition
    that is true ends it. A tick answers how many are left."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def tick(self, count_down: CountDown, actor_id: int, subject: str, context: Context, stop_condition: Callable[[], bool] = condition_unmet) -> int:
        if stop_condition():
            self.reset(count_down, actor_id, context)
            return count_down.remaining_after(0)
        kept = self.kept(count_down, actor_id)
        used_count = kept.used_count + 1 if kept is not None and kept.subject == subject else 1
        if kept is None:
            self.repository.save(Countdown(actor_id=actor_id, creator_id=context.actor.id, key=count_down.key, subject=subject, used_count=used_count), context)
        else:
            self.repository.update(kept, context, subject=subject, used_count=used_count)
        return count_down.remaining_after(used_count)

    def reset(self, count_down: CountDown, actor_id: int, context: Context) -> None:
        kept = self.kept(count_down, actor_id)
        if kept is not None:
            self.repository.delete_stored(kept, context)

    def used_count(self, count_down: CountDown, actor_id: int) -> int:
        kept = self.kept(count_down, actor_id)
        return 0 if kept is None else kept.used_count

    def kept(self, count_down: CountDown, actor_id: int) -> Countdown | None:
        return self.queries.query(Countdown).filter(actor_id=actor_id, key=count_down.key).first()
