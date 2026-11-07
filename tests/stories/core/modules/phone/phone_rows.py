from core.base.actor import Actor
from tests.stories.core.support.fixtures import UserJoined

TOKEN_DIGEST = "f00d" * 16


def paired_story(new_story):
    story = new_story(fixture=UserJoined)
    code = story.run("phone pair --json", actor=story.user).output_text.split('"code": "')[1].split('"')[0]
    story.expect_success(f"phone redeem {code} --token-digest {TOKEN_DIGEST}", actor=Actor.core())
    return story


def test_an_agent_cannot_unpair_a_persons_phone(new_story):
    story = paired_story(new_story)
    story.expect_refusal("phone unpair 1", "only the phone's person unpairs it", actor=story.agent)


def test_the_person_unpairs_their_own_phone(new_story):
    story = paired_story(new_story)
    story.expect_success("phone unpair 1", "state: unpaired", actor=story.user)


def test_no_one_edits_a_phone_or_a_code(new_story):
    story = paired_story(new_story)
    story.expect_usage_error(f"phone edit 1 --token-digest {'beef' * 16}", actor=story.user)
    story.expect_usage_error("phone-code delete 1", actor=story.user)


def test_an_agent_cannot_make_a_phone_code(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("phone pair", "only a person pairs a phone", actor=story.agent)


def test_the_event_log_keeps_no_digest(new_story):
    story = paired_story(new_story)
    story.expect_rows(TOKEN_DIGEST not in story.run("event list --json", actor=story.user).output_text)
