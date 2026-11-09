from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from tests.stories.core.support.fixtures import UserJoined

REASON = "the merger should run on Codex, as asked in message 110327"
SAVE_MERGER = 'profile save journal-merger --description "Merges workers" --program codex'


def cards(story) -> list[ApprovalRequest]:
    return list(story.container.get(Queries).query(ApprovalRequest).all_rows())


def test_an_agent_that_asks_a_person_without_a_reason_is_refused_and_no_card_is_made(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(SAVE_MERGER, "an approval needs a reason", actor=story.agent)
    story.expect_rows(cards(story) == [])


def test_an_agent_that_gives_a_reason_has_it_on_the_card_under_the_question(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f'{SAVE_MERGER} --reason "{REASON}"', "A person was asked in the dock", actor=story.agent)
    requested = cards(story)
    story.expect_rows(len(requested) == 1, requested[0].why == REASON, detail=str(requested))
    story.expect_text(f"approval show {requested[0].id}", REASON, actor=story.user)


def test_a_request_that_would_fail_when_accepted_is_refused_to_the_agent_and_no_card_is_shown(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f'profile save critic --program codex --reason "{REASON}"', "this would fail when a person accepts it: a profile needs a description", actor=story.agent)
    story.expect_rows(cards(story) == [])


def test_trying_a_request_before_its_card_changes_nothing_until_a_person_accepts(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f'profile save careful --description "Reads carefully" --reason "{REASON}"', "A person was asked in the dock", actor=story.agent)
    story.expect_no_text("profile list", "careful", actor=story.user)
