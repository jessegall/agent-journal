import shutil
import stat

from engine.database.database import Database
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.private.private_folder import PROJECT_ID_FILE
from core.modules.secrets.migrations.m003_erased_deleted_secrets import ErasedDeletedSecretsMigration

from tests.stories.core.modules.secrets.support.private_home import REPLACEMENT_VALUE, VALUE, filled_story, private_folder, values_text
from tests.stories.core.modules.secrets.support.secret_fixtures import SecretMade
from tests.stories.core.support.fixtures import UserJoined

__all__ = ["private_folder"]


def made_story(played):
    return played(SecretMade)
















def test_a_filled_value_lives_only_in_the_values_file_outside_the_project_readable_by_its_user_alone(played, private_folder):
    story = filled_story(played)
    story.expect_text("secret show 1", "key  GITHUB_KEY  filled, hidden", actor=story.agent)
    values_file = next(private_folder.glob("*.env"))
    story.expect_rows(VALUE in values_text(private_folder), stat.S_IMODE(values_file.stat().st_mode) == 0o600,
                      VALUE.encode() not in story.home.database.read_bytes(), not values_file.resolve().is_relative_to(story.home.folder.resolve()))




















OLD_SECRETS_TABLE = ("CREATE TABLE secrets (id INTEGER PRIMARY KEY, fields TEXT NOT NULL, deleted_at TEXT)",
                     "CREATE INDEX secrets_active ON secrets (deleted_at, id) WHERE deleted_at IS NULL")
OLD_SECRET_ROW = "INSERT INTO secrets (id, fields, deleted_at) VALUES (?, ?, ?)"


def test_a_secret_deleted_before_deletion_erased_it_loses_its_value_when_the_migration_drops_its_row(played, private_folder, tmp_path):
    story = filled_story(played, 'secret make "Stripe"', f"secret fill 2 key {REPLACEMENT_VALUE}")
    old_home = JournalHome(tmp_path / "old-journal")
    old_home.folder.mkdir()
    shutil.copy(story.home.folder / PROJECT_ID_FILE, old_home.folder / PROJECT_ID_FILE)
    old_database = Database.opened(old_home)
    for statement in OLD_SECRETS_TABLE:
        old_database.update(Statement(statement))
    old_database.insert(Statement(OLD_SECRET_ROW, [1, '[{"name": "key", "hidden": true, "variable": "GITHUB_KEY"}]', "2026-11-01T00:00:00+00:00"]))
    old_database.insert(Statement(OLD_SECRET_ROW, [2, '[{"name": "key", "hidden": true, "variable": "STRIPE_KEY"}]', None]))
    ErasedDeletedSecretsMigration().run(old_database)
    old_database.close()
    story.expect_rows(VALUE not in values_text(private_folder), "GITHUB_KEY" not in values_text(private_folder), REPLACEMENT_VALUE in values_text(private_folder))
