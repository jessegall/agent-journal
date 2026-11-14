import json
from dataclasses import dataclass
from urllib.parse import urlparse

from engine.actor.actor import Actor
from tests.integration.support.integration_journal import IntegrationJournal
from tests.integration.support.server_harness import viewer_answer


@dataclass(frozen=True)
class SharedLink:
    """What `share make` answers: the link's number and the path that carries its token."""

    id: int
    link: str

    @property
    def path(self) -> str:
        return urlparse(self.link).path


# plan 1 with the phases Values, Models and Queries and two open tasks, First and Second, and a second plan 2 with
# one phase of its own, made by the user
def plan_and_person(journal: IntegrationJournal) -> Actor:
    user = journal.make_user()
    lines = ['plan make "Version 5 core" --environment main', *[f'phase make --plan 1 "{title}" --goal "{title.lower()} pass their tests"' for title in ("Values", "Models", "Queries")],
             'task make "First" --brief "The first task" --environment main', 'task make "Second" --brief "The second task" --environment main',
             'plan make "Version 5 core" --environment main', 'phase make --plan 2 "Elsewhere" --goal "not shared"']
    for line in lines:
        answer = journal.run(line, user)
        assert answer.code == 0, (line, answer.text)
    return user


def shared_link(server, user: Actor) -> tuple[str, SharedLink]:
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    made = json.loads(server.journal.run("share make plans:1 --json", user).text)
    return cookie, SharedLink(int(made["id"]), str(made["link"]))


# a visitor opens the link and gets the share cookie the link page sets
def opened(server, share: SharedLink) -> str:
    status, headers, body = viewer_answer(server.viewer_port(), share.path, "", "")
    cookie = headers.get("Set-Cookie", "")
    assert status == 200 and '<div id="app">' in body and cookie.startswith(server.cookie_name("journal_share") + "=") and "HttpOnly" in cookie and "SameSite=Strict" in cookie, (status, headers, body)
    return cookie.split(";", 1)[0]
