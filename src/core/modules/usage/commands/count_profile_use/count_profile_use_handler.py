from dataclasses import replace

from engine.time.clock import Clock
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.usage.commands.count_profile_use.count_profile_use import CountProfileUse
from core.modules.usage.models.statistic import Statistic


class CountProfileUseHandler(Handler[CountProfileUse, None]):
    """Adds one to how often a profile was used and keeps when, in the statistics version 4's counts moved to."""

    command = CountProfileUse

    def __init__(self, queries: Queries, repository: Repository, clock: Clock) -> None:
        self.queries, self.repository, self.clock = queries, repository, clock

    def handle(self, command: CountProfileUse, context: Context) -> None:
        uses = self.row(f"profiles.{command.profile}.uses")
        self.repository.save(replace(uses, value=uses.value + 1), context)
        last_used = self.row(f"profiles.{command.profile}.last_used")
        self.repository.save(replace(last_used, value=int(self.clock.timestamp().value.timestamp())), context)

    def row(self, key: str) -> Statistic:
        return self.queries.query(Statistic).filter(key=key).first() or Statistic(key=key)
