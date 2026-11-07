import json
import shutil
from pathlib import Path

import pytest

from core.testing.story import Story
from tests.stories.core.modules.library.support.copy_stories import connected, shared_server
from tests.stories.core.modules.library.support.stored_text import every_stored_text
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

DENIED = "your role cannot do this"


def users_of(story: Story) -> dict[str, dict[str, object]]:
    return {user["name"]: user for user in json.loads(story.run("library-user list --json", story.agent).output_text)["users"]}


def user_id(server: SharedServerBinary, token: str, name: str) -> int:
    return next(int(str(user["id"])) for user in server.send(token, "GET", "/users")[1]["users"] if user["name"] == name)


def token_works(server: SharedServerBinary, token: str) -> bool:
    return server.send(token, "GET", "/me")[0] == 200


def stored_anywhere(story: Story, text: str) -> bool:
    files = [path for path in Path(story.home.folder).rglob("*") if path.is_file() and path.stat().st_size < 5_000_000]
    return text in every_stored_text(story) or any(text in path.read_bytes().decode(errors="ignore") for path in files if path.suffix != ".env")


def test_an_admin_lists_the_users_with_their_roles(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    story.expect_text("library-user list", "user 1: Ada, admin", "user 2: Grace, edit", "user 3: Linus, read", actor=story.agent)
    story.expect_rows(users_of(story)["Grace"]["role"] == "edit")


def test_an_admin_adds_a_user_and_the_first_token_is_shown_once_and_kept_nowhere(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    outcome = story.run("library-user add Mira --role edit", story.user)
    token_text = next(line for line in outcome.output_text.splitlines() if line.startswith("token (shown once): ")).split(": ", 1)[1]
    story.expect_rows(outcome.code == 0, "user " in outcome.output_text and "Mira, edit" in outcome.output_text, token_works(server, token_text))
    story.expect_rows(not stored_anywhere(story, token_text), users_of(story)["Mira"]["role"] == "edit")


def test_an_admin_changes_a_role_and_the_user_has_it_at_the_next_request(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    token_text = server.new_user("Nell", "read")
    nell = user_id(server, tokens.admin, "Nell")
    story.expect_text(f"library-user role {nell} edit", "Nell, edit", actor=story.user)
    story.expect_rows(server.send(token_text, "POST", "/items/doc", {"fields": {"title": "T", "abstract": "A", "body": "B"}})[0] == 201)
    story.expect_usage_error(f"library-user role {nell} owner", actor=story.user)


def test_an_admin_removes_a_user_and_their_token_stops_working(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    token_text = server.new_user("Otto", "edit")
    otto = user_id(server, tokens.admin, "Otto")
    story.expect_rows(token_works(server, token_text))
    story.expect_text(f"library-user remove {otto}", "Otto, edit, removed", actor=story.user)
    story.expect_rows(not token_works(server, token_text))


def test_an_admin_reads_the_tokens_of_a_user_and_revokes_one(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    token_text = server.new_user("Pia", "edit")
    pia = user_id(server, tokens.admin, "Pia")
    listed = json.loads(story.run(f"library-user tokens {pia} --json", story.agent).output_text)["tokens"]
    story.expect_rows(len(listed) == 1, listed[0]["revoked_at"] == "")
    story.expect_text(f"library-user tokens {pia}", f"token {listed[0]['id']}:", actor=story.agent)
    story.expect_text(f"library-user revoke {listed[0]['id']}", f"token {listed[0]['id']}:", "revoked", actor=story.user)
    story.expect_rows(not token_works(server, token_text))


@pytest.mark.parametrize("line", ["library-user list", "library-user tokens 1"])
def test_a_role_that_may_not_administer_cannot_read_users_or_tokens(new_story, shared_server, line):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal(line, DENIED, actor=story.agent)


@pytest.mark.parametrize("line", ["library-user add Quin --role edit", "library-user role 3 edit", "library-user remove 3"])
def test_a_role_that_may_not_administer_cannot_change_users(new_story, shared_server, line):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    story.expect_refusal(line, DENIED, actor=story.user)


def test_a_user_revokes_their_own_token_and_not_that_of_another(new_story, shared_server):
    server, tokens = shared_server
    admin_story = connected(new_story, server, tokens.admin)
    owner_token, friend_token = server.new_user("Rue", "edit"), server.new_user("Sol", "edit")
    token_numbers = {name: server.send(tokens.admin, "GET", f"/users/{user_id(server, tokens.admin, name)}/tokens")[1]["tokens"][0]["id"] for name in ("Rue", "Sol")}
    admin_story.expect_rows(token_works(server, owner_token), token_works(server, friend_token))
    refused = server.send(owner_token, "DELETE", f"/tokens/{token_numbers['Sol']}")
    admin_story.expect_rows(refused[0] == 403, token_works(server, friend_token))
    admin_story.expect_rows(server.send(owner_token, "DELETE", f"/tokens/{token_numbers['Rue']}")[0] == 200, not token_works(server, owner_token))


@pytest.mark.parametrize("line", ["library-user add Tess --role edit", "library-user role 3 edit", "library-user remove 3", "library-user revoke 1"])
def test_an_agent_cannot_change_users_or_tokens(new_story, shared_server, line):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.admin)
    story.expect_refusal(line, "an agent cannot", actor=story.agent)


def test_with_no_connection_the_users_are_not_read(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_refusal("library-user list", "This journal is not connected to a shared server.", actor=story.agent)
