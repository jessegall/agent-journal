import json
import shutil
from datetime import timedelta

import pytest

from core.modules.documents.models.doc import Doc
from core.modules.library.support.library_client import LibraryClient
from core.modules.library.errors.library_unreachable_error import LibraryUnreachableError
from core.testing.story import Story
from tests.stories.core.modules.library.support.copy_stories import (server_change, connected, connected_second, item_copy, new_item, second_story, shared_server)
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]


def copies(story: Story) -> list[dict[str, object]]:
    return json.loads(story.run("library copies --json", story.agent).output_text)["rows"]


def copy_json(story: Story, item_id: int) -> dict[str, object]:
    return next(row for row in copies(story) if row["item_id"] == item_id)


def read_role(story: Story) -> str:
    return str(json.loads(story.run("library status --json", story.agent).output_text)["role"])


def server_fields(server: SharedServerBinary, token: str, item_id: int) -> dict[str, object]:
    return server.send(token, "GET", f"/items/doc/{item_id}")[1]


def test_the_team_stories_run_end_to_end_on_two_journals_and_one_server(new_story, templates, tmp_path, shared_server):
    server, tokens = shared_server
    grace = connected(new_story, server, tokens.editor)
    linus = connected_second(second_story(templates, tmp_path / "linus"), server, tokens.reader)
    try:
        item_id = new_item(server, tokens.admin, "Release checklist", "Tag first.\nBuild second.")

        # Story 4: Linus gets the document, and Grace's later change arrives as a revision of its own
        linus.expect_text(f"library get doc {item_id}", "is now doc 1", actor=linus.user)
        grace.expect_text(f"library get doc {item_id}", "is now doc 1", actor=grace.user)
        grace.expect_success('doc edit 1 --body "Tag first.\\nBuild after the tag."', actor=grace.user)

        # Story 5: Grace's edit saves at once, shows as Sending, and is In sync after a round
        grace.expect_text("library copies", "Status: Sending", actor=grace.agent)
        grace.expect_text("library sync", "1 copies followed, 1 changed.", actor=grace.agent)
        grace.expect_text("library copies", f"doc 1 follows library doc {item_id}, version 2. Status: In sync", actor=grace.agent)
        linus.expect_text("library sync", "1 copies followed, 1 changed.", actor=linus.agent)
        linus.expect_text("library copies", f"doc 1 follows library doc {item_id}, version 2. Status: In sync", actor=linus.agent)
        linus.expect_text("doc show 1 --all", "Build after the tag.", actor=linus.agent)
        linus.expect_text("doc revision 1 2", "Build after the tag.", actor=linus.user)
        linus.expect_text("doc revision 1 1", "Build second.", actor=linus.user)

        # Story 6: Linus has no write access; his edit stays, and a newer version does not overwrite it
        linus.expect_success('doc edit 1 --body "Linus note."', actor=linus.user)
        linus.expect_text("library sync", "1 changed.", actor=linus.agent)
        linus.expect_text("library copies", "Status: Local change, not sent", actor=linus.agent)
        linus.expect_rows(read_role(linus) == "read")
        server_change(server, tokens.editor, item_id, "Release checklist", "Tag first.\nBuild in the morning.", 2)
        linus.expect_text("library sync", "1 changed.", actor=linus.agent)
        denied = copy_json(linus, item_id)
        linus.expect_rows(denied["status"] == "denied", denied["server_version"] == 3, denied["version"] == 2, linus.row(Doc, 1).body == "Linus note.")
        linus.expect_rows(denied["server_fields"]["body"] == "Tag first.\nBuild in the morning.", denied["local_fields"]["body"] == "Linus note.")

        # Story 7: Linus is given edit rights; his waiting change meets a newer library version, so he chooses
        server.run("user role Linus edit")
        linus.expect_text("library sync", "1 changed.", actor=linus.agent)
        linus.expect_rows(read_role(linus) == "edit")
        linus.expect_rows(copy_json(linus, item_id)["status"] == "conflict")

        # Story 10: Linus uses the library's version and his text stays in the revisions; Grace, back from a train, keeps hers
        linus.expect_text(f"library resolve {item_copy(linus, item_id).id} --keep library", "Status: In sync", actor=linus.user)
        linus.expect_rows(linus.row(Doc, 1).body == "Tag first.\nBuild in the morning.")
        linus.expect_text("doc revision 1 3", "Linus note.", actor=linus.user)
        grace.expect_success('doc edit 1 --body "Grace on the train."', actor=grace.user)
        server_change(server, tokens.admin, item_id, "Release checklist", "Ada while Grace was away.", 3)
        grace.expect_text("library sync", "1 changed.", actor=grace.agent)
        grace.expect_rows(copy_json(grace, item_id)["status"] == "conflict", grace.row(Doc, 1).body == "Grace on the train.")
        grace.expect_text(f"library resolve {item_copy(grace, item_id).id} --keep mine", "Status: In sync", actor=grace.user)
        kept = server_fields(server, tokens.admin, item_id)
        grace.expect_rows(kept["version"] == 5, kept["fields"]["body"] == "Grace on the train.")
        linus.expect_text("library sync", "1 changed.", actor=linus.agent)
        linus.expect_rows(linus.row(Doc, 1).body == "Grace on the train.")

        # Story 13: Linus works offline for a day on two copies, and everything goes up when the network returns
        first, second = new_item(server, tokens.admin, "Offline first"), new_item(server, tokens.admin, "Offline second")
        linus.expect_text(f"library get doc {first}", "is now doc 2", actor=linus.user)
        linus.expect_text(f"library get doc {second}", "is now doc 3", actor=linus.user)
        client = linus.container.get(LibraryClient)
        real_state = client.state

        def unreachable_state() -> object:
            raise LibraryUnreachableError("No network.")

        client.state = unreachable_state
        linus.expect_success('doc edit 2 --body "Edited offline."', actor=linus.user)
        linus.advance(timedelta(days=1))
        linus.expect_success('doc edit 3 --body "Edited offline too."', actor=linus.user)
        linus.expect_text("library sync", "Did not reach the library. No network.", actor=linus.agent)
        waiting = [row["status"] for row in copies(linus) if row["item_id"] in (first, second)]
        client.state = real_state
        linus.expect_rows(waiting == ["unsent", "unsent"])
        linus.expect_text("library sync", "3 copies followed, 2 changed.", actor=linus.agent)
        linus.expect_rows(server_fields(server, tokens.admin, first)["fields"]["body"] == "Edited offline.", server_fields(server, tokens.admin, second)["fields"]["body"] == "Edited offline too.")

        # Story 14: Ada removes the document; both copies stay and say so, and a restore makes them follow again
        server.send(tokens.admin, "DELETE", f"/items/doc/{item_id}")
        for story in (grace, linus):
            story.expect_text("library sync", "Reached the library", actor=story.agent)
            story.expect_text("library copies", "Status: Removed from the library", actor=story.agent)
            story.expect_rows(story.row(Doc, 1).body == "Grace on the train.", copy_json(story, item_id)["status"] == "removed")
        server.send(tokens.admin, "POST", f"/items/doc/{item_id}/restore")
        for story in (grace, linus):
            story.expect_text("library sync", "Reached the library", actor=story.agent)
            story.expect_rows(copy_json(story, item_id)["status"] == "synced")

        # Story 18: a bad edit reaches everyone, and a restored version reaches everyone again
        good = server_fields(server, tokens.admin, item_id)["version"]
        grace.expect_success('doc edit 1 --body "zzz nonsense"', actor=grace.user)
        grace.expect_text("library sync", "1 changed.", actor=grace.agent)
        linus.expect_text("library sync", "1 changed.", actor=linus.agent)
        linus.expect_rows(linus.row(Doc, 1).body == "zzz nonsense")
        grace.expect_text(f"library versions doc {item_id}", f"version {good}", actor=grace.agent)
        grace.expect_text(f"library restore doc {item_id} --version {good}", f"library doc {item_id} is back at the text of version {good}, as version {good + 2}", actor=grace.user)
        for story in (grace, linus):
            story.expect_text("library sync", "Reached the library", actor=story.agent)
            story.expect_rows(story.row(Doc, 1).body == "Grace on the train.", copy_json(story, item_id)["version"] == good + 2)

        # Story 16: Linus stops following a copy; it becomes a plain document and the server keeps its item
        offline_copy = item_copy(linus, first)
        last_item = server_fields(server, tokens.admin, first)
        linus.expect_text(f"library leave {offline_copy.id}", f"doc 2 no longer follows library doc {first}", actor=linus.user)
        linus.expect_rows(item_copy(linus, first) is None, linus.row(Doc, 2).body == "Edited offline.", server_fields(server, tokens.admin, first) == last_item)
        linus.expect_text("library sync", "Reached the library", actor=linus.agent)
        linus.expect_rows(linus.row(Doc, 2).body == "Edited offline.")
    finally:
        linus.close()
