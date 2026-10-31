import re

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import ServerStory, server_story

PAIR_LINE = {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}
CODE_SHAPE = re.compile(r"^[A-Z]{4}-[A-Z]{4}$")
UNKNOWN_CODE_REFUSAL = "this code pairs no phone"


def paired_code(story: ServerStory) -> tuple[str, dict[str, object]]:
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    return cookie, story.viewer_line_value(cookie, PAIR_LINE)


def test_a_person_pairs_a_phone_with_a_short_code_and_a_link_that_carries_it(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        _, pairing = paired_code(story)
        assert CODE_SHAPE.match(str(pairing["code"])), pairing
        assert str(pairing["link"]).endswith(f"/pair#code={pairing['code']}"), pairing
        phone = story.expect_phone_paired(str(pairing["code"]))
        story.expect_viewer_status("/api/session", 200, phone, text='"type": "phone"')


def test_a_code_pairs_one_phone_once(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        _, pairing = paired_code(story)
        story.expect_phone_paired(str(pairing["code"]))
        story.expect_pairing_refusal(str(pairing["code"]), UNKNOWN_CODE_REFUSAL)


def test_a_wrong_code_is_refused(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_pairing_refusal("ABCD-EFGH", UNKNOWN_CODE_REFUSAL)


def test_a_phone_reads_and_runs_as_the_person_who_paired_it(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        _, pairing = paired_code(story)
        phone = story.expect_phone_paired(str(pairing["code"]))
        story.expect_viewer_line(phone, {"window": "tasks.tasks", "line": ["task", "list"], "environment": "main"}, 200, '"code": 0')


def test_an_unpaired_phone_is_logged_out(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie, pairing = paired_code(story)
        phone = story.expect_phone_paired(str(pairing["code"]))
        phones = story.viewer_line_value(cookie, {"window": "phone.phones", "line": ["phone", "list"], "environment": "main"})
        story.viewer_line_value(cookie, {"window": "phone.phones", "line": ["phone", "unpair", str(phones["rows"][0]["id"])], "environment": "main"})
        story.expect_viewer_status("/api/session", 401, phone)


def test_the_pairing_page_opens_without_a_session(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/pair", 200, text='<div id="app">')


def test_a_phone_stays_paired_when_the_server_restarts(new_story):
    journal = new_story(fixture=UserJoined)
    with server_story(journal) as story:
        _, pairing = paired_code(story)
        phone = story.expect_phone_paired(str(pairing["code"]))
    with server_story(journal) as story:
        story.expect_viewer_status("/api/session", 200, phone, text='"type": "phone"')
