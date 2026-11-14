from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seeder import Seeder
from engine.time.clock import Clock
from tests.integration.support.integration_journal import MAIN_ENVIRONMENT, IntegrationJournal

READ_LIMIT_ROWS = 50


def seeded(journal: IntegrationJournal, seed: type[Seed], count: int, **fixed: object) -> tuple[int, ...]:
    """Many rows of a seed in the main environment, written at once below every row the test makes."""
    seeder = Seeder(journal.database, journal.container.get(Clock).timestamp().text, MAIN_ENVIRONMENT)
    with seeder.filling():
        return seeder.seed(seed(), count, **fixed)


# from here on a read that returns more than 50 rows, or more than it declared, raises
def limit_reads(journal: IntegrationJournal) -> None:
    journal.database.read_limit_rows = READ_LIMIT_ROWS
