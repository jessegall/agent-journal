from dataclasses import dataclass
from urllib.parse import urlparse

from tests.stories.core.support import story_lines as lines
from core.testing.story_fixture import StoryFixture
from core.testing.story import Story
from tests.stories.core.support.fixtures import PlanWithTasks, UserJoined
from tests.stories.server.support.server_client import ServerStory, server_story, viewer_answer

SHARE_WINDOW = "sharing.shares"
PLAN_WINDOW = "plans.plans"
PLAN_SHARE_REQUEST = {"window": SHARE_WINDOW, "line": ["share", "create", PLAN_WINDOW, "1"], "environment": "main"}
DEAD_LINK_NOTICE = "This link doesn't open anything"
LOCAL_ADDRESS = "http://127.0.0.1:"


class PlanAndPerson(StoryFixture):
    """Plan 1 with two open tasks, a second plan 2, and a person, Ada, beside the agent."""

    parent = PlanWithTasks

    def steps(self, story: Story) -> None:
        story.run(lines.NEW_PLAN)
        UserJoined().steps(story)

    def expect(self, story: Story) -> None:
        story.expect_success("plan show 2", "title: Version 5 core")


@dataclass(frozen=True)
class SharedLink:
    """What `share create` answers: the row's id, the address to hand out and whether it is a tunnel's."""

    id: int
    link: str
    public: bool

    @property
    def path(self) -> str:
        return urlparse(self.link).path


def shared_link(story: ServerStory) -> tuple[str, SharedLink]:
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    answer = story.viewer_line_value(cookie, PLAN_SHARE_REQUEST)
    return cookie, SharedLink(int(str(answer["id"])), str(answer["link"]), answer["public"] is True)


def opened(story: ServerStory, share: SharedLink) -> str:
    status, headers, body = viewer_answer(story.viewer_port(), share.path, "", "")
    cookie = headers.get("Set-Cookie", "")
    assert status == 303 and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers, body)
    return cookie.split(";", 1)[0]


def phases(plan: str) -> dict[str, object]:
    return {"window": PLAN_WINDOW, "line": ["phase", "list", "--plan", plan], "environment": "main"}


def read(plan: str, window: str = PLAN_WINDOW) -> dict[str, object]:
    return {"window": window, "line": ["plan", "show", plan], "environment": "main"}


def test_a_person_makes_a_link_for_a_plan_and_it_is_the_local_address_when_no_tunnel_is_open(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        assert share.link.startswith(LOCAL_ADDRESS) and "/share/" in share.link, share
        assert not share.public, share


def test_opening_a_link_gives_a_share_session_that_works_again_until_the_link_ends(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        first = opened(story, share)
        story.expect_viewer_status("/api/session", 200, first, text='"type": "share"')
        second = opened(story, share)
        story.expect_viewer_status("/api/session", 200, second, text='"type": "share"')


def test_a_revoked_link_is_gone_and_a_made_up_one_is_unknown(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        cookie, share = shared_link(story)
        story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "revoke", str(share.id)], "environment": "main"})
        story.expect_viewer_status(share.path, 410)
        story.expect_viewer_status("/share/not-a-link", 404)


def test_a_revoked_link_ends_the_sessions_it_opened(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        cookie, share = shared_link(story)
        visitor = opened(story, share)
        story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "revoke", str(share.id)], "environment": "main"})
        story.expect_viewer_status("/api/session", 401, visitor)


def test_the_shell_says_what_a_dead_link_is(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        story.expect_viewer_status("/share/not-a-link", 404, text=DEAD_LINK_NOTICE)


def test_a_share_session_reads_the_shared_plan_and_its_phases_as_the_person_who_made_the_link_and_no_other_plan(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_line(visitor, read("1"), 200, '"code": 0')
        story.expect_viewer_line(visitor, phases("1"), 200, '"code": 0')
        story.expect_viewer_line(visitor, read("2"), 403, "not shared")
        story.expect_viewer_line(visitor, phases("2"), 403, "not shared")


def test_a_share_session_reads_only_the_lines_its_window_declares(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": ["task", "list"], "environment": "main"}, 403, "not shared")
        story.expect_viewer_line(visitor, {"window": "tasks.tasks", "line": ["task", "list"], "environment": "main"}, 403, "not shared")
        story.expect_viewer_line(visitor, {"window": "settings.settings", "line": ["setting", "tree"], "environment": "main"}, 403, "not shared")


def test_a_share_session_reads_no_other_environment(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_line(visitor, {**read("1"), "environment": "other"}, 403, "not shared")


def test_a_share_session_runs_no_command_with_or_without_waive(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        for line in (["plan", "start", "1"], ["plan", "start", "1", "--waive"], ["task", "make", "Sneaky", "--environment", "main"], ["share", "create", PLAN_WINDOW, "1"]):
            story.expect_viewer_line(visitor, {"window": PLAN_WINDOW, "line": line, "environment": "main"}, 403, "a share link only reads")


def test_a_share_session_sees_its_window_alone_and_no_marks_docks_layouts_settings_or_waiting(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_status("/api/windows?environment=main", 200, visitor, text=PLAN_WINDOW)
        _, _, windows = viewer_answer(story.viewer_port(), "/api/windows?environment=main", visitor, "")
        assert "tasks.tasks" not in windows and "messages.chat" not in windows, windows
        for route in ("/api/marks", "/api/docks", "/api/waiting", "/api/skills"):
            story.expect_viewer_status(f"{route}?environment=main", 403, visitor)


def test_a_share_session_follows_only_the_events_of_the_rows_it_shows(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_status("/api/events?cursor=0&environment=main", 403, visitor)
        story.expect_viewer_status("/api/events?cursor=0&environment=main&plan=1", 200, visitor)


def test_a_share_session_cannot_ask_for_a_login_key(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
        story.expect_viewer_status("/api/viewer-key", 403, visitor)
        story.expect_viewer_line(visitor, {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}, 403, "a share link only reads")


def test_a_person_lists_and_revokes_their_links(new_story):
    with server_story(new_story(fixture=PlanAndPerson)) as story:
        cookie, share = shared_link(story)
        listed = story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "list"], "environment": "main"})
        assert [row["id"] for row in listed["rows"]] == [share.id], listed
        story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "revoke", str(share.id)], "environment": "main"})
        assert story.viewer_line_value(cookie, {"window": SHARE_WINDOW, "line": ["share", "list"], "environment": "main"})["rows"] == []


def test_a_link_stays_open_when_the_server_restarts(new_story):
    journal = new_story(fixture=PlanAndPerson)
    with server_story(journal) as story:
        _, share = shared_link(story)
        visitor = opened(story, share)
    with server_story(journal) as story:
        story.expect_viewer_status("/api/session", 200, visitor, text='"type": "share"')
