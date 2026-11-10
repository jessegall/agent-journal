import pytest

from engine.database.database import Database
from engine.query.queries import Queries
from core.modules.accounts.models.person_login import PersonLogin
from core.modules.accounts.models.person_session import PersonSession
from core.modules.accounts.models.login_attempt import LoginAttempt
from core.modules.accounts.models.person_factor import PersonFactor
from core.modules.accounts.models.recovery_code import RecoveryCode
from core.modules.accounts.models.audit_entry import AuditEntry
from core.modules.accounts.models.setup_code import SetupCode
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

SHARED_COLUMNS = ["id", "creator_id", "version", "metadata", "created_at", "updated_at"]


@pytest.mark.parametrize("table, columns", [
    ("person_logins", ["person_id", "name", "password_digest"]),
    ("person_sessions", ["person_id", "token_digest", "device", "address", "last_active_at", "factor_checked_at", "expires_at", "ended_at"]),
    ("login_attempts", ["address_digest", "name", "attempted_at"]),
    ("person_factors", ["person_id", "factor_type", "label", "credential", "removed_at"]),
    ("recovery_codes", ["person_id", "code_digest", "used_at"]),
    ("audit_entries", ["person_id", "event_type", "address", "device", "detail"]),
    ("setup_codes", ["code_digest", "expires_at", "used_at"]),
])
def test_a_new_journal_has_every_accounts_table_with_every_column(new_story, table, columns):
    story = new_story(fixture=UserJoined)
    table_columns = [row["name"] for row in story.container.get(Database).connection.execute(f"PRAGMA table_info({table})").fetchall()]
    expect_value(sorted(table_columns), sorted([*SHARED_COLUMNS, *columns]))


@pytest.mark.parametrize("model", [PersonLogin, PersonSession, LoginAttempt, PersonFactor, RecoveryCode, AuditEntry, SetupCode])
def test_every_accounts_model_reads_its_own_table(new_story, model):
    story = new_story(fixture=UserJoined)
    expect_value(tuple(story.container.get(Queries).query(model).all_rows()), ())


def test_an_agent_has_no_command_for_the_accounts_rows(new_story):
    story = new_story(fixture=UserJoined)
    for name in ("person-login", "person-session", "login-attempt", "person-factor", "recovery-code", "audit-entry", "setup-code"):
        expect_value(story.run(f"{name} list").code != 0, True)
