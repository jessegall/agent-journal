import pytest

import http.client
import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from urllib.parse import urlparse

from tests.stories.core.support import story_lines as lines
from core.testing.story_fixture import StoryFixture
from core.testing.story import Story
from tests.stories.core.support.fixtures import PlanWithTasks
from tests.stories.server.support.server_client import ServerStory, server_story, viewer_answer
from tests.stories.support.story_checks import expect_id_cancelled, expect_value_line, expect_value_without
from tests.stories.server.window_data_route import window_data

SHARE_WINDOW = "sharing.shares"
PLAN_WINDOW = "plans.plans"


class PlanAndPersonFixture(StoryFixture):
    """Plan 1 with two open tasks, a second plan 2, and a person, Ada, beside the agent."""

    parent = PlanWithTasks

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_PLAN)
        story.run('phase make --plan 2 "Elsewhere" --goal "not shared"')

    def expect(self, story: Story) -> None:
        story.expect_success("plan show 2", "title: Version 5 core")


@dataclass(frozen=True)
class SharedLink:
    """What `share make` answers: the link's number and the path that carries its token."""

    id: int
    link: str

    @property
    def path(self) -> str:
        return urlparse(self.link).path


def shared_link(story: ServerStory) -> tuple[str, SharedLink]:
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    made = json.loads(story.story.run("share make plans:1 --json", actor=story.story.user).output_text)
    return cookie, SharedLink(int(made["id"]), str(made["link"]))


def revoke(story: ServerStory, share: SharedLink) -> None:
    story.story.expect_success(f"share revoke {share.id}", "state: revoked", actor=story.story.user)


def opened(story: ServerStory, share: SharedLink) -> str:
    status, headers, body = viewer_answer(story.viewer_port(), share.path, "", "")
    cookie = headers.get("Set-Cookie", "")
    assert status == 200 and '<div id="app">' in body and cookie.startswith("journal_share=") and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers, body)
    return cookie.split(";", 1)[0]


def phases(plan: str) -> dict[str, object]:
    return {"window": PLAN_WINDOW, "line": ["phase", "list", "--plan", plan], "environment": "main"}


def read(plan: str, window: str = PLAN_WINDOW) -> dict[str, object]:
    return {"window": window, "line": ["plan", "show", plan], "environment": "main"}


def test_opening_a_link_gives_a_share_session_that_works_again_until_the_link_ends(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    first = opened(story, share)
    story.expect_viewer_status("/api/session", 200, first, text='"type": "share"')
    second = opened(story, share)
    story.expect_viewer_status("/api/session", 200, second, text='"type": "share"')


def test_the_session_route_tells_the_shell_which_row_the_link_shows_and_when_it_ends(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/session", 200, visitor, text='"share": {"row_model": "plan", "row_id": 1, "window": {')



def test_a_stale_person_cookie_beside_the_share_cookie_does_not_hide_the_share_session(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/session", 200, f"journal_session=a-session-from-another-journal; {visitor}", text='"type": "share"')

def test_the_share_page_loads_every_file_it_names_with_only_the_share_cookie(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    _, _, page = viewer_answer(story.viewer_port(), share.path, visitor, "")
    names = re.findall(r'(?:src|href)="(/viewer/[^"]+)"|"(?:vue|@journal/window-kit)": "([^"]+)"', page)
    paths = {first or second for first, second in names}
    expect_value_line(paths, "vendor/vue")
    expect_value_line(paths, "/assets/")
    expect_value_line(paths, "window-kit")
    for path in paths:
        story.expect_viewer_status(path, 200, visitor)


def test_a_revoked_link_is_gone_and_a_made_up_one_is_unknown(shared_plan_link):
    story, ((cookie, share)) = shared_plan_link
    revoke(story, share)
    story.expect_viewer_status(share.path, 410, text='<meta name="journal-share" content="gone">')
    story.expect_viewer_status("/viewer/share/not-a-link", 404, text='<meta name="journal-share" content="gone">')


def test_the_plans_window_of_a_share_loads_and_reads_the_shared_plan_with_only_the_share_cookie(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    _, _, session = viewer_answer(story.viewer_port(), "/api/session", visitor, "")
    entry = json.loads(session)["share"]["window"]["entry_url"]
    story.expect_viewer_status(entry, 200, visitor, text="plans")
    story.expect_viewer_line(visitor, {"window": "plans.plans", "line": ["plan", "show", "1"], "environment": "main"}, 200, '"code": 0')
    story.expect_viewer_line(visitor, {"window": "plans.plans", "line": ["plan", "progress", "1"], "environment": "main"}, 200, '"code": 0')
    story.expect_viewer_line(visitor, {"window": "plans.plans", "line": ["phase", "list", "--plan", "1", "--oldest"], "environment": "main"}, 200, '"code": 0')


def test_a_live_link_page_carries_no_gone_mark(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    _, _, page = viewer_answer(story.viewer_port(), share.path, "", "")
    expect_value_without(page, "journal-share")


def test_a_dead_link_page_clears_the_share_cookie_a_visitor_holds(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    _, headers, _ = viewer_answer(story.viewer_port(), "/viewer/share/not-a-link", visitor, "")
    expect_headers_with(headers, "Set-Cookie", "", "journal_share=;")
    expect_cookie_headers_with(headers, "Max-Age=0")


def test_a_revoked_link_ends_the_sessions_it_opened(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    revoke(story, share)
    story.expect_viewer_status("/api/session", 401, visitor)


def test_a_share_session_reads_the_shared_plan_and_its_phases_as_the_person_who_made_the_link_and_no_other_plan(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, read("1"), 200, '"code": 0')
    story.expect_viewer_line(visitor, phases("1"), 200, '"code": 0')
    story.expect_viewer_line(visitor, read("2"), 403, "not shared by the link")
    story.expect_viewer_line(visitor, phases("2"), 403, "not shared by the link")


def test_a_share_session_reads_the_phases_the_plan_holds_and_no_phase_of_another_plan(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["phase", "show", "1"], "environment": "main"}, 200, '"code": 0')
    story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["phase", "show", "4"], "environment": "main"}, 403, "not shared by the link")


def test_a_share_session_reads_only_the_lines_its_window_declares(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["task", "list"], "environment": "main"}, 403, "not shared by the link")
    story.expect_viewer_line(visitor, {"window": "tasks.tasks", "line": ["task", "list"], "environment": "main"}, 403, "not shared by the link")
    story.expect_viewer_line(visitor, {"window": "settings.settings", "line": ["setting", "tree"], "environment": "main"}, 403, "not shared by the link")


def test_a_share_session_reads_no_other_environment(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_line(visitor, {**read("1"), "environment": "other"}, 403, "not shared by the link")


def test_a_share_session_runs_no_command_with_or_without_waive(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    for line in (["plan", "start", "1"], ["plan", "start", "1", "--waive"], ["task", "make", "Sneaky", "--environment", "main"], ["share", "make", "plans:1"]):
        story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": line, "environment": "main"}, 403, "a share link only reads")


def test_a_share_session_reads_no_data_route_but_its_own_session_and_stream(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    for route in ("/api/windows", "/api/waiting", "/api/marks", "/api/docks", "/api/skills", "/api/anything"):
        story.expect_viewer_status(f"{route}?environment=main", 403, visitor, text="opens only the row it shares")
    story.expect_viewer_status("/api/session", 200, visitor, text='"type": "share"')


def test_the_server_picks_the_window_that_shows_the_shared_row_and_ignores_the_name_a_client_sends(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/session", 200, visitor, text='"window": {"name": "plans.plans"')
    story.expect_viewer_line(visitor, {"window": "settings.settings", "line": ["plan", "show", "1"], "environment": "main"}, 200, '"code": 0')


def share_events(story: ServerStory, cookie: str, count: int, environment: str) -> list[dict[str, object]]:
    port = story.viewer_port()
    connection = http.client.HTTPConnection("127.0.0.1", port, timeout=10)
    try:
        connection.request("GET", f"/api/events?cursor=0&environment={environment}", headers={"Host": f"127.0.0.1:{port}", "Cookie": cookie})
        response = connection.getresponse()
        assert response.status == 200, response.status
        events: list[dict[str, object]] = []
        while len(events) < count:
            line = response.readline().decode()
            if line.startswith("data: "):
                events.append(json.loads(line[6:]))
        return events
    finally:
        connection.close()


def test_a_share_session_follows_only_the_events_of_the_rows_it_shows_in_its_own_environment(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    followed = share_events(story, visitor, 4, "other")
    expect_table_event_id("plans", 1, "phases", 1, "phases", 2, "phases", 3, followed)


def test_a_share_session_cannot_ask_for_a_login_key(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    story.expect_viewer_status("/api/viewer-key", 403, visitor)
    story.expect_viewer_line(visitor, {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}, 403, "a share link only reads")


def test_a_person_lists_and_revokes_their_links(shared_plan_link):
    story, ((cookie, share)) = shared_plan_link
    listed = story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "list"], "environment": "main"})
    expect_id_cancelled(listed, [share.id])
    story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "revoke", str(share.id)], "environment": "main"})
    expect_state_viewer(story, cookie, "window", "line", "environment", SHARE_WINDOW, "share", "list", "main", ["revoked"])


def test_a_link_stays_open_when_the_server_restarts(new_story):
    journal = new_story(fixture=PlanAndPersonFixture)
    journal.advance(datetime.now(timezone.utc) - journal.clock.timestamp().value)
    with server_story(journal) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
    with server_story(journal) as story:
        story.expect_viewer_status("/api/session", 200, visitor, text='"type": "share"')


def test_a_spent_login_link_opened_with_only_a_share_cookie_is_refused(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    visitor = opened(story, share)
    key = story.viewer_key("Ada")
    story.expect_viewer_login(key)
    story.expect_viewer_status(f"/?key={key}", 401, visitor)


@pytest.fixture
def plan_server(new_story):
    journal = new_story(fixture=PlanAndPersonFixture)
    journal.advance(datetime.now(timezone.utc) - journal.clock.timestamp().value)
    with server_story(journal) as story:
        yield story


@pytest.fixture
def shared_plan_link(plan_server):
    return plan_server, shared_link(plan_server)


def expect_state_viewer(story, cookie, text, text_2, text_3, item, text_4, text_5, text_6, expected) -> None:
    actual = [row['state'] for row in story.viewer_line_value(cookie, {text: item, text_2: [text_4, text_5], text_3: text_6})['rows']]
    assert actual == expected, actual


def expect_table_event_id(text, number, text_2, number_2, text_3, number_3, text_4, number_4, followed) -> None:
    actual = all(((event['row_table'], event['row_id']) in {(text, number), (text_2, number_2), (text_3, number_3), (text_4, number_4)} for event in followed))
    assert actual, actual


def expect_headers_with(headers, text, text_2, expected) -> None:
    actual = headers.get(text, text_2)
    assert expected in actual, actual


def expect_cookie_headers_with(headers, expected) -> None:
    actual = headers['Set-Cookie']
    assert expected in actual, actual


def test_a_share_session_reads_window_keys_with_the_rights_of_its_link(shared_plan_link):
    story, ((_, share)) = shared_plan_link
    cookie = opened(story, share)
    status, answer = window_data(story, cookie, keys="pins")
    story.story.expect_rows(status == 200, answer["keys"]["pins"]["code"] != 0)
