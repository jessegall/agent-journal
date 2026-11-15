from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from core.modules.drivers.commands.prune_driver_comparisons.prune_driver_comparisons import PruneDriverComparisons
from core.modules.drivers.models.driver_comparison import DriverComparison
from core.modules.drivers.support.driver_settings import COMPARISON_DAYS_SETTING

DAY_SECONDS = 86_400
BATCH_ROWS = 500
BATCH_REASON = "one batch of the oldest comparisons, deleted together on one tick"


class PruneDriverComparisonsHandler(Handler[PruneDriverComparisons, None]):
    """Deletes a batch of the comparisons older than the setting comparison-days, the oldest first."""

    command = PruneDriverComparisons

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def handle(self, command: PruneDriverComparisons, context: Context) -> None:
        cutoff = context.timestamp.plus_seconds(-self.settings.number(COMPARISON_DAYS_SETTING) * DAY_SECONDS)
        rows = self.queries.query(DriverComparison).matching(Less("created_at", cutoff.text)).oldest().limit(BATCH_ROWS, BATCH_REASON).get()
        self.repository.delete_many_stored(rows, context)
