from tests.stories.server.support.server_fixtures import person_server

import pytest

import re

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import ServerStory, server_story

PAIR_LINE = {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}
CODE_SHAPE = re.compile(r"^[A-Z]{4}-[A-Z]{4}$")
UNKNOWN_CODE_REFUSAL = "this code pairs no phone"


def paired_code(story: ServerStory) -> tuple[str, dict[str, object]]:
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    return cookie, story.viewer_line_value(cookie, PAIR_LINE)


def test_a_person_pairs_a_phone_with_a_short_code_and_a_link_that_carries_it(person_server):
    story = person_server
    _, pairing = paired_code(story)
    expect_match_code_shape(CODE_SHAPE, pairing)
    expect_endswith_link_pairing(pairing, f"/pair#code={pairing['code']}")
    phone = story.expect_phone_paired(str(pairing["code"]))
    story.expect_viewer_status("/api/session", 200, phone, text='"type": "phone"')


def test_a_code_pairs_one_phone_once(person_server):
    story = person_server
    _, pairing = paired_code(story)
    story.expect_phone_paired(str(pairing["code"]))
    story.expect_pairing_refusal(str(pairing["code"]), UNKNOWN_CODE_REFUSAL)


def test_a_wrong_code_is_refused(person_server):
    story = person_server
    story.expect_pairing_refusal("ABCD-EFGH", UNKNOWN_CODE_REFUSAL)


def test_a_phone_reads_and_runs_as_the_person_who_paired_it(person_server):
    story = person_server
    _, pairing = paired_code(story)
    phone = story.expect_phone_paired(str(pairing["code"]))
    story.expect_viewer_line(phone, {"window": "tasks.tasks", "line": ["task", "list"], "environment": "main"}, 200, '"code": 0')


def test_an_unpaired_phone_is_logged_out(person_server):
    story = person_server
    cookie, pairing = paired_code(story)
    phone = story.expect_phone_paired(str(pairing["code"]))
    phones = story.viewer_line_value(cookie, {"window": "phone.phones", "line": ["phone", "list"], "environment": "main"})
    story.viewer_line_value(cookie, {"window": "phone.phones", "line": ["phone", "unpair", str(phones["rows"][0]["id"])], "environment": "main"})
    story.expect_viewer_status("/api/session", 401, phone)


def test_the_pairing_page_opens_without_a_session(person_server):
    story = person_server
    story.expect_viewer_status("/pair", 200, text='<div id="app">')


def test_a_phone_stays_paired_when_the_server_restarts(new_story):
    journal = new_story(fixture=UserJoined)
    with server_story(journal) as story:
        _, pairing = paired_code(story)
        phone = story.expect_phone_paired(str(pairing["code"]))
    with server_story(journal) as story:
        story.expect_viewer_status("/api/session", 200, phone, text='"type": "phone"')


def expect_endswith_link_pairing(pairing, text) -> None:
    actual = str(pairing['link']).endswith(text)
    assert actual, actual


def expect_match_code_shape(item, pairing) -> None:
    actual = item.match(str(pairing['code']))
    assert actual, actual
