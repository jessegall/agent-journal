import json
import shlex
import shutil

import pytest

from core.base.actor import CORE_ACTOR_ID, Actor
from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.library.models.enums.copy_state import CopyState
from core.modules.library.models.library_copy import LibraryCopy
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.sequences.models.sequence import Sequence
from core.testing.story import Story
from tests.stories.core.modules.library.support.copy_stories import connected, shared_server
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.server.support.shared_server_binary import SharedServerBinary

__all__ = ["private_folder", "shared_server"]

pytestmark = [pytest.mark.skipif(shutil.which("go") is None, reason="the shared server needs go to build"), pytest.mark.usefixtures("private_folder")]

TRIGGERS = json.dumps([{"trigger_type": "phrase", "text": "give me an update"}])


def sequence_fields(title: str, *steps: str) -> dict[str, str]:
    return {"title": title, "steps": json.dumps(list(steps)), "step_guards": "[]"}


def new_sequence(server: SharedServerBinary, token: str, title: str, *steps: str) -> int:
    return int(str(server.send(token, "POST", "/items/sequence", {"fields": sequence_fields(title, *steps)})[1]["id"]))


def change_sequence(server: SharedServerBinary, token: str, item_id: int, version: int, title: str, *steps: str) -> None:
    code = server.send(token, "PUT", f"/items/sequence/{item_id}", {"fields": sequence_fields(title, *steps)}, {"If-Match": f'"{version}"'})[0]
    assert code == 200


def library_sequence_story(new_story, server: SharedServerBinary, tokens, title: str, *steps: str) -> tuple[Story, int, int]:
    item_id = new_sequence(server, tokens.admin, title, *steps)
    story = connected(new_story, server, tokens.editor)
    local = story.run(f"library get sequence {item_id}", story.user).output_text
    row_id = int(local.rsplit(" ", 1)[1])
    return story, item_id, row_id


def stored_copy(story: Story, item_id: int) -> LibraryCopy:
    return next(copy for copy in story.container.get(Queries).query(LibraryCopy).filter(share="sequence").all_rows() if copy.item_id == item_id)


def test_a_sequence_arrives_with_its_steps_and_no_triggers(new_story, shared_server):
    server, tokens = shared_server
    story, item_id, row_id = library_sequence_story(new_story, server, tokens, "Release from the library", "Run the suite", "Tag the release")
    story.expect_ordered_lines(f"sequence show {row_id}", f"sequence {row_id}: Release from the library, starts by hand only", "1. Run the suite", "2. Tag the release", actor=story.user)
    story.expect_rows(story.row(Sequence, row_id).triggers == "[]", story.row(Sequence, row_id).creator_id == story.user.id)


def test_a_trigger_added_here_is_kept_when_a_new_version_arrives(new_story, shared_server):
    server, tokens = shared_server
    story, item_id, row_id = library_sequence_story(new_story, server, tokens, "Triggered locally", "Run the suite", "Tag the release")
    story.expect_text(f"sequence edit {row_id} --triggers {shlex.quote(TRIGGERS)}", f"updated: sequence:{row_id}", actor=story.user)
    change_sequence(server, tokens.admin, item_id, 1, "Triggered locally, renamed", "Run the suite", "Tag the release")
    story.expect_text("library sync", "1 copies followed, 1 changed.", actor=story.agent)
    kept = story.row(Sequence, row_id)
    story.expect_rows(kept.title == "Triggered locally, renamed", kept.triggers == TRIGGERS, stored_copy(story, item_id).state is CopyState.SYNCED)
    story.expect_rows(server.send(tokens.admin, "GET", f"/items/sequence/{item_id}")[1]["version"] == 2)


def test_new_steps_wait_for_a_run_to_end_and_arrive_after_it(new_story, shared_server):
    server, tokens = shared_server
    story, item_id, row_id = library_sequence_story(new_story, server, tokens, "Waits for its run", "Run the suite", "Tag the release")
    story.expect_text(f"sequence run {row_id}", "Run the suite", actor=story.agent)
    change_sequence(server, tokens.admin, item_id, 1, "Waits for its run", "Run the suite", "Tag the release", "Announce it")
    story.expect_text("library sync", "Reached the library", actor=story.agent)
    story.expect_rows(len(story.row(Sequence, row_id).steps) == 2, stored_copy(story, item_id).state is CopyState.SYNCED)
    story.expect_text("library copies", "Status: Waiting for its run to end", actor=story.agent)
    story.run("sequence follow", actor=story.agent)
    story.expect_text('sequence abandon --why "not today" --sure', f"sequence {row_id} abandoned", actor=story.agent)
    story.expect_text("library sync", "1 copies followed, 1 changed.", actor=story.agent)
    story.expect_rows(story.row(Sequence, row_id).steps == ("Run the suite", "Tag the release", "Announce it"))
    story.expect_text("library copies", "Status: In sync", actor=story.agent)


def test_choosing_the_library_version_is_refused_while_a_run_is_going(new_story, shared_server):
    server, tokens = shared_server
    story, item_id, row_id = library_sequence_story(new_story, server, tokens, "Refused during a run", "Run the suite", "Tag the release")
    story.expect_text(f"sequence edit {row_id} --title \"Renamed here\"", f"updated: sequence:{row_id}", actor=story.user)
    change_sequence(server, tokens.admin, item_id, 1, "Renamed there", "Run the suite", "Tag the release")
    story.expect_text("library sync", "1 changed.", actor=story.agent)
    story.expect_rows(stored_copy(story, item_id).state is CopyState.CONFLICT)
    story.expect_text(f"sequence run {row_id}", "Run the suite", actor=story.agent)
    story.expect_refusal(f"library resolve {stored_copy(story, item_id).id} --keep library", "this sequence is running: use the library's version when the run ends", actor=story.user)
    story.run("sequence follow", actor=story.agent)
    story.expect_text('sequence abandon --why "not today" --sure', f"sequence {row_id} abandoned", actor=story.agent)
    story.expect_text(f"library resolve {stored_copy(story, item_id).id} --keep library", "Status: In sync", actor=story.user)
    story.expect_rows(story.row(Sequence, row_id).title == "Renamed there")


def test_a_sequence_that_comes_with_the_journal_cannot_be_shared(new_story, shared_server):
    server, tokens = shared_server
    story = connected(new_story, server, tokens.editor)
    standard = story.container.get(Repository).save(Sequence(creator_id=CORE_ACTOR_ID, title="Comes with the journal", steps=("Run the suite", "Tag the release")), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))
    story.expect_refusal(f"library share sequence {standard.id}", f"sequence {standard.id} cannot be shared: this comes with the journal", actor=story.user)
    story.expect_rows(server.send(tokens.admin, "GET", "/items?kind=sequence&search=journal")[1]["total"] == 0)
