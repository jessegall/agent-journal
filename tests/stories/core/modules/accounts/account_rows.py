import pytest

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.accounts.guards.account_rows_guard import AccountRowsGuard
from core.modules.accounts.models.audit_entry import AuditEntry
from core.modules.accounts.models.enums.person_factor_type import PersonFactorType
from core.modules.accounts.models.login_attempt import LoginAttempt
from core.modules.accounts.models.person_factor import PersonFactor
from core.modules.accounts.models.person_login import PersonLogin
from core.modules.accounts.models.person_session import PersonSession
from core.modules.accounts.models.recovery_code import RecoveryCode
from core.modules.accounts.models.setup_code import SetupCode
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

REFUSAL = "refused by accounts.account-rows: accounts are written only by the journal itself"


def account_rows(story) -> list:
    now, person_id, creator_id = story.clock.timestamp(), story.user.id, story.user.id
    return [PersonLogin(creator_id=creator_id, person_id=person_id, name="owner", password_digest="f00d"),
            PersonSession(creator_id=creator_id, person_id=person_id, token_digest="f00d", device="laptop", address="127.0.0.1",
                          last_active_at=now, factor_checked_at=now, expires_at=now),
            PersonFactor(creator_id=creator_id, person_id=person_id, factor_type=PersonFactorType.PASSKEY, label="laptop", credential="f00d"),
            RecoveryCode(creator_id=creator_id, person_id=person_id, code_digest="f00d"),
            LoginAttempt(creator_id=creator_id, address_digest="f00d", name="owner", attempted_at=now),
            AuditEntry(creator_id=creator_id, person_id=person_id, event_type="login", address="127.0.0.1", device="laptop", detail=""),
            SetupCode(creator_id=creator_id, code_digest="f00d", expires_at=now)]


def context_of(story, actor: Actor, skipped_guards: frozenset[str] = frozenset()) -> Context:
    return Context(actor, story.clock.timestamp(), ReadMessage(1), skipped_guards)


def saved_by_core(story) -> list:
    repository = story.container.get(Repository)
    with story.container.get(Database).transaction():
        return [repository.save(row, context_of(story, Actor.core())) for row in account_rows(story)]


def refusal_of(story, action, actor: Actor, skipped_guards: frozenset[str] = frozenset()) -> str:
    with pytest.raises(Refusal) as refused, story.container.get(Database).transaction():
        action(story.container.get(Repository), context_of(story, actor, skipped_guards))
    return refused.value.text


def test_the_journal_itself_writes_and_deletes_every_account_row(new_story):
    story = new_story(fixture=UserJoined)
    rows = saved_by_core(story)
    repository = story.container.get(Repository)
    with story.container.get(Database).transaction():
        for row in rows:
            repository.delete(row, context_of(story, Actor.core()))
    expect_value([tuple(story.container.get(Queries).query(type(row)).all_rows()) for row in rows], [()] * len(rows))


@pytest.mark.parametrize("who", ["agent", "user"])
def test_neither_an_agent_nor_a_person_creates_an_account_row(new_story, who):
    story = new_story(fixture=UserJoined)
    actor = getattr(story, who)
    for row in account_rows(story):
        expect_value(refusal_of(story, lambda repository, context, row=row: repository.save(row, context), actor), REFUSAL)


@pytest.mark.parametrize("who", ["agent", "user"])
def test_neither_an_agent_nor_a_person_changes_or_deletes_an_account_row(new_story, who):
    story = new_story(fixture=UserJoined)
    actor = getattr(story, who)
    for row in saved_by_core(story):
        expect_value(refusal_of(story, lambda repository, context, row=row: repository.delete(row, context), actor), REFUSAL)
        expect_value(refusal_of(story, lambda repository, context, row=row: repository.update(row, context, creator_id=row.creator_id + 1), actor), REFUSAL)


def test_no_skip_flag_passes_the_account_rows_guard(new_story):
    story = new_story(fixture=UserJoined)
    skipped = frozenset({AccountRowsGuard.name})
    for row in account_rows(story):
        expect_value(refusal_of(story, lambda repository, context, row=row: repository.save(row, context), story.agent, skipped), REFUSAL)
        expect_value(refusal_of(story, lambda repository, context, row=row: repository.save(row, context), story.user, skipped), REFUSAL)
