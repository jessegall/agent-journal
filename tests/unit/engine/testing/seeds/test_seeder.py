import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.errors.missing_seed_error import MissingSeedError
from engine.journal.journal_home import JournalHome
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seed_facts import SeedFacts
from engine.testing.seeds.seeder import Seeder

SEEDED_AT = "2026-10-31T09:00:00.000000+00:00"
TABLES = (
    "CREATE TABLE shelves (id INTEGER PRIMARY KEY, title TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
    "CREATE TABLE crates (id INTEGER PRIMARY KEY, shelf_id INTEGER NOT NULL REFERENCES shelves(id), title TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'packed',"
    " created_at TEXT NOT NULL) STRICT",
    "CREATE TRIGGER crates_rule_state_insert BEFORE INSERT ON crates WHEN NEW.state NOT IN ('packed') BEGIN SELECT RAISE(ABORT, 'rule: a crate starts packed'); END",
)


class ShelfSeed(Seed):
    """A made-up shelf."""

    table = "shelves"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"title": f"Shelf {index + 1}"}


class CrateSeed(Seed):
    """A made-up crate on one of the seeded shelves, already shipped."""

    table = "crates"

    def columns(self, index: int, facts: SeedFacts) -> dict[str, object]:
        return {"shelf_id": facts.row_id("shelves", index), "title": f"Crate {index + 1}", "state": "shipped"}


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    for statement in TABLES:
        opened.update(Statement(statement))
    yield opened
    opened.close()


def values(database: Database, sql: str) -> list[tuple[object, ...]]:
    return [tuple(row) for row in database.rows(Statement(sql))]


def test_seeded_rows_are_numbered_downwards_from_zero_and_carry_the_time_of_the_seed(database):
    row_ids = Seeder(database, SEEDED_AT, 1).seed(ShelfSeed(), 3)
    assert row_ids == (0, -1, -2)
    assert values(database, "SELECT id, title, created_at, updated_at FROM shelves ORDER BY id DESC") == [
        (0, "Shelf 1", SEEDED_AT, SEEDED_AT), (-1, "Shelf 2", SEEDED_AT, SEEDED_AT), (-2, "Shelf 3", SEEDED_AT, SEEDED_AT)]


def test_a_row_made_after_a_seed_is_numbered_as_if_no_seed_were_there(database):
    Seeder(database, SEEDED_AT, 1).seed(ShelfSeed(), 3)
    database.update(Statement("INSERT INTO shelves (title, created_at, updated_at) VALUES ('Mine', ?, ?)", [SEEDED_AT, SEEDED_AT]))
    assert values(database, "SELECT id FROM shelves WHERE title = 'Mine'") == [(1,)]


def test_a_second_seed_of_a_table_goes_on_below_the_first_and_leaves_the_rows_of_a_story_alone(database):
    seeder = Seeder(database, SEEDED_AT, 1)
    seeder.seed(ShelfSeed(), 2)
    database.update(Statement("INSERT INTO shelves (title, created_at, updated_at) VALUES ('Mine', ?, ?)", [SEEDED_AT, SEEDED_AT]))
    assert seeder.seed(ShelfSeed(), 2) == (-2, -3)
    assert values(database, "SELECT id FROM shelves WHERE title = 'Mine'") == [(1,)]


def test_a_seed_points_its_rows_at_the_rows_seeded_before_it_in_turn(database):
    seeder = Seeder(database, SEEDED_AT, 1)
    seeder.seed(ShelfSeed(), 2)
    with seeder.disabled_rules():
        seeder.seed(CrateSeed(), 3)
    assert values(database, "SELECT id, shelf_id, state FROM crates ORDER BY id DESC") == [(0, 0, "shipped"), (-1, -1, "shipped"), (-2, 0, "shipped")]


def test_a_value_given_with_the_seed_replaces_the_seeds_own(database):
    seeder = Seeder(database, SEEDED_AT, 1)
    seeder.seed(ShelfSeed(), 1)
    seeder.seed(CrateSeed(), 2, state="packed", title="Mine")
    assert values(database, "SELECT title, state FROM crates") == [("Mine", "packed"), ("Mine", "packed")]


def test_the_rules_of_the_tables_hold_again_after_a_seed_and_refuse_a_finished_row_outside_it(database):
    seeder = Seeder(database, SEEDED_AT, 1)
    seeder.seed(ShelfSeed(), 1)
    with seeder.disabled_rules():
        seeder.seed(CrateSeed(), 1)
    with pytest.raises(Exception, match="a crate starts packed"):
        seeder.seed(CrateSeed(), 1)


def test_a_seed_that_points_at_a_table_nothing_has_seeded_says_which_table_to_seed_first(database):
    with pytest.raises(MissingSeedError, match="shelves"):
        Seeder(database, SEEDED_AT, 1).seed(CrateSeed(), 1)
