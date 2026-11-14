import pytest

from engine.database.database import Database
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


@pytest.mark.parametrize("model", [PersonLogin, PersonSession, LoginAttempt, PersonFactor, RecoveryCode, AuditEntry, SetupCode])
def test_every_accounts_model_reads_its_own_table(new_story, model):
    story = new_story(fixture=UserJoined)
    expect_value(tuple(story.story_rows(model)), ())


