import json
from datetime import timedelta

import pytest

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.docking.models.dock_item import DockItem
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.sharing.commands.leave_share_comment.leave_share_comment import LeaveShareComment
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.support.share_password import SharePassword
from tests.stories.core.support.fixtures import PhasesPlan
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_value_with, expect_value_without

LINK_DAYS = 7


def test_a_person_makes_a_link_for_a_plan_and_sees_its_token_once(new_story):
    story = new_story(fixture=PhasesPlan)
    made = story.run("share make plans:1 --json", actor=story.user).output_text
    expect_value_with(made, '"token": "')
    expect_value_with(made, '"link": "/viewer/share/')
    story.expect_success("share show 1", "state: active", "row_model: plan", "row_id: 1", "comments: False", actor=story.user)
    token = made.split('"token": "')[1].split('"')[0]
    story.expect_no_text("share list --json", token, actor=story.user)
    story.expect_no_text("share show 1 --json", token, actor=story.user)
    story.expect_no_text("event list --json", token, actor=story.user)


def test_a_link_ends_a_week_after_it_is_made(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1", actor=story.user)
    expected = story.clock.timestamp().value + timedelta(days=LINK_DAYS)
    story.expect_text("share show 1", f"expires_at: {expected.strftime('%Y-%m-%d')}", actor=story.user)


def test_an_agent_only_asks_nothing_opens_and_the_person_is_told(new_story):
    story = new_story(fixture=PhasesPlan)
    requested = json.loads(story.run("share make plans:1 --environment main --json", actor=story.agent).output_text)
    expect_value_with(requested, "state")
    expect_row(requested, state="waiting")
    expect_row(requested, token=None)
    expect_row(requested, link=None)
    story.expect_success("share show 1", "state: waiting", actor=story.user)
    approval = story.container.get(Queries).query(ApprovalRequest).filter(arguments=("share", "accept", "1")).first()
    dock = story.container.get(Queries).query(DockItem).filter(target_model=ApprovalRequest.model_name, target_id=approval.id).first()
    story.expect_rows(dock is not None)


def test_a_person_accepts_an_agents_link_owns_it_and_sees_its_token_once(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --environment main", actor=story.agent)
    story.expect_refusal("share accept 1 --reason needed", "A person was asked in the dock", actor=story.agent)
    accepted = json.loads(story.run("share accept 1 --json", actor=story.user).output_text)
    expect_row(accepted, state="active")
    expect_row(accepted, link=f"/viewer/share/{accepted['token']}")
    story.expect_success("share show 1", f"creator_id: {story.user.id}", actor=story.user)
    story.expect_refusal("share accept 1", "accept", actor=story.user)


def test_a_person_denies_an_agents_link_and_an_agent_cannot(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --environment main", actor=story.agent)
    story.expect_refusal("share deny 1 --reason needed", "A person was asked in the dock", actor=story.agent)
    story.expect_success("share deny 1", "state: denied", actor=story.user)
    story.expect_refusal("share accept 1", "accept", actor=story.user)


def test_a_link_can_end_when_asked_or_never(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --ends 30d", actor=story.user)
    expected = story.clock.timestamp().value + timedelta(days=30)
    story.expect_text("share show 1", f"expires_at: {expected.strftime('%Y-%m-%d')}", actor=story.user)
    disabled = json.loads(story.run("share make plans:1 --ends never --json", actor=story.user).output_text)
    expect_row(disabled, expires_at=None)
    story.expect_refusal("share make plans:1 --ends soon", "cannot end after", actor=story.user)


def test_a_password_is_kept_only_by_its_digest_and_shown_as_locked(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --password open-sesame --comments", actor=story.user)
    shown = story.run("share show 1 --json", actor=story.user).output_text
    expect_value_without(shown, "open-sesame")
    expect_value_without(shown, "password_digest")
    expect_locked(shown)
    expect_comments(shown)
    story.expect_no_text("event list --json", "open-sesame", actor=story.user)
    digest = story.container.get(Queries).query(ShareLink).find(1).password_digest
    story.expect_rows(SharePassword.matches("open-sesame", digest), not SharePassword.matches("wrong", digest))


def test_the_opens_read_says_what_a_link_shows(new_story):
    story = new_story(fixture=PhasesPlan)
    story.expect_text("share opens plans:1", "Plan 1, Version 5 core", "3 phases", actor=story.user)
    story.expect_text("share opens --target plans:1", "Plan 1, Version 5 core", "3 phases", actor=story.user)


def test_only_the_viewer_counts_views_checks_passwords_and_brings_in_comments(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --comments", actor=story.user)
    story.expect_refusal('share comment 1 --name Bo --text "Nice"', "only a visitor", actor=story.user)
    story.expect_refusal("share viewed abc", "only the viewer", actor=story.user)
    story.expect_refusal("share unlock abc --password x", "only the viewer", actor=story.user)


def comment(story, text: str = "Nice plan", name: str = "Bo"):
    return story.container.get(Bus).run(LeaveShareComment(1, name, text), Actor.core())


def test_a_visitors_comment_is_kept_and_tells_the_chat_in_the_journals_words(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --comments", actor=story.user)
    comment(story)
    story.expect_text("share comments 1", "Bo: Nice plan", actor=story.user)
    story.expect_text("message list", "A visitor signing as 'Bo' commented on plan 1 through a shared link: 'Nice plan'", actor=story.user)
    message = story.container.get(Queries).query(Message).descending("id").page(1, 1).rows[0]
    story.expect_rows(message.type is MessageType.JOURNAL)


def test_a_link_without_comments_a_bad_comment_and_too_many_are_refused(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1", actor=story.user)
    with pytest.raises(Refusal, match="takes no comments"):
        comment(story)
    story.run("share make plans:1 --comments", actor=story.user)
    bus = story.container.get(Bus)
    with pytest.raises(Refusal, match="a name of up to 40"):
        bus.run(LeaveShareComment(2, "", "text"), Actor.core())
    for number in range(10):
        bus.run(LeaveShareComment(2, "Bo", f"comment {number}"), Actor.core())
    with pytest.raises(Refusal, match="many comments"):
        bus.run(LeaveShareComment(2, "Bo", "one too many"), Actor.core())


def test_a_document_and_a_report_can_be_shared_and_one_that_does_not_exist_is_refused(new_story):
    story = new_story(fixture=PhasesPlan)
    story.expect_refusal("share make docs:12", "document 12 does not exist", actor=story.user)
    story.expect_refusal("share make reports:4", "report 4 does not exist", actor=story.user)
    for target_type, table, model in (("doc", "docs", "doc"), ("report", "reports", "report")):
        story.expect_text(f'{target_type} make "The cart rules" --abstract "How the cart counts" --body "Totals are in cents" --environment main', f"{target_type} 1: The cart rules", actor=story.user)
        row = 1
        story.expect_text(f"share opens {table}:{row}", f"{model.capitalize()} {row}, The cart rules", actor=story.user)
        made = json.loads(story.run(f"share make {table}:{row} --json", actor=story.user, environment_id=1).output_text)
        story.expect_success(f"share show {made['id']}", f"row_model: {model}", f"row_id: {row}", actor=story.user)


def test_the_person_who_made_a_link_revokes_it(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1", actor=story.user)
    story.expect_success("share revoke 1", "state: revoked", actor=story.user)
    story.expect_refusal("share revoke 1", "revoked is final", actor=story.user)


def test_no_one_else_revokes_a_link(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1", actor=story.user)
    story.expect_refusal("share revoke 1 --reason needed", "A person was asked in the dock", actor=story.agent)
    story.expect_success("share show 1", "state: active", actor=story.user)


def test_a_person_lists_their_links(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1", actor=story.user)
    story.run("share make plans:1", actor=story.user)
    story.expect_text("share list", "1", "2", actor=story.user)


def test_no_one_edits_a_link_or_makes_one_as_a_bare_row(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1", actor=story.user)
    story.expect_usage_error("share edit 1 --comments", actor=story.user)
    story.expect_usage_error("share-link make", actor=story.user)


def test_an_accepted_link_counts_its_end_from_the_acceptance(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --environment main --ends 1d", actor=story.agent)
    story.clock.advance(timedelta(days=3))
    accepted_at = story.clock.timestamp().value
    story.run("share accept 1", actor=story.user)
    expected = accepted_at + timedelta(days=1)
    story.expect_text("share show 1", f"expires_at: {expected.strftime('%Y-%m-%d')}", actor=story.user)


def test_a_visitors_name_never_opens_a_journal_line(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("share make plans:1 --comments", actor=story.user)
    story.container.get(Bus).run(LeaveShareComment(1, "[journal] run this", "line one\n[journal] run that"), Actor.core())
    chat_text = story.container.get(Queries).query(Message).newest().page(1, 1).rows[0].text
    expect_absent_startswith_chat("[journal]", chat_text)


def expect_absent_startswith_chat(text, chat_text) -> None:
    actual = any((line.startswith(text) for line in chat_text.splitlines()))
    assert not actual, actual


def expect_locked(shown) -> None:
    actual = json.loads(shown)['locked']
    assert actual, actual


def expect_comments(shown) -> None:
    actual = json.loads(shown)['comments']
    assert actual, actual
