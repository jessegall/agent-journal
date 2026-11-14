import json

from engine.query.queries import Queries
from core.modules.viewer.commands.support.window_lines import WindowLines
from core.modules.viewer.errors.window_refusal import WindowRefusal
from core.modules.messages.models.message import Message
from core.modules.processes.models.reader_request import ReaderRequest
from tests.stories.core.modules.processes.support.process_samples import install_runner, started_run
from tests.stories.core.support.coding_fixtures import UserBuilder


def card(story, process_id: int) -> dict:
    return json.loads(story.run(f"process card {process_id} --json", actor=story.user).output_text)


def test_asking_for_a_reader_opens_one_request_and_posts_one_chat_message_from_the_person_naming_the_output(played):
    story = install_runner(played(UserBuilder))
    process = started_run(story, "make build")
    story.expect_success(f"output ask-reader {process.id} --environment main", f"reader request 1 is open for make build", actor=story.user)
    queries = story.container.get(Queries)
    messages = list(story.story_rows(Message))
    story.expect_rows(len(story.story_rows(ReaderRequest)) == 1, len(messages) == 1, messages[0].creator_id == story.user.id, f"Output {process.id}" in messages[0].text, detail=str(messages))






def test_the_output_dock_may_run_the_line_of_its_button_and_no_other_write(played):
    story = install_runner(played(UserBuilder))
    lines = story.container.get(WindowLines)
    lines.check("processes.output", ["output", "ask-reader", "1", "--environment", "main"], story.user, "main")
    refused = False
    try:
        lines.check("processes.output", ["message", "send", "hello", "--environment", "main"], story.user, "main")
    except WindowRefusal:
        refused = True
    story.expect_rows(refused)
