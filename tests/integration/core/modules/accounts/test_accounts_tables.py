from tests.stories.support.story_checks import expect_value
import pytest

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
def test_a_new_journal_has_every_accounts_table_with_every_column(journal, table, columns):
    table_columns = [row["name"] for row in journal.database.connection.execute(f"PRAGMA table_info({table})").fetchall()]
    expect_value(sorted(table_columns), sorted([*SHARED_COLUMNS, *columns]))


def test_an_agent_has_no_command_for_the_accounts_rows(journal):
    for name in ("person-login", "person-session", "login-attempt", "person-factor", "recovery-code", "audit-entry", "setup-code"):
        expect_value(journal.run(f"{name} list").code != 0, True)
