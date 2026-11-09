import json

from core.base.query.queries import Queries
from core.modules.viewer.commands.support.window_lines import WindowLines
from core.modules.viewer.commands.support.window_refusal import WindowRefusal
from core.modules.messages.models.message import Message
from core.modules.processes.models.reader_request import ReaderRequest
from tests.stories.core.modules.processes.support.process_samples import install_runner, started_run
from tests.stories.core.support.coding_fixtures import UserBuilder


def card(story, process_id: int) -> dict:
    return json.loads(story.run(f"process card {process_id} --json", actor=story.user).output_text)


def test_asking_for_a_reader_opens_one_request_and_posts_one_chat_message_from_the_person_naming_the_output(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = started_run(story, "make build")
    story.expect_success(f"output ask-reader {process.id} --environment main", f"reader request 1 is open for make build", actor=story.user)
    queries = story.container.get(Queries)
    messages = list(queries.query(Message).all_rows())
    story.expect_rows(len(list(queries.query(ReaderRequest).all_rows())) == 1, len(messages) == 1, messages[0].creator_id == story.user.id, f"Output {process.id}" in messages[0].text, detail=str(messages))


def test_the_card_of_a_run_that_was_asked_about_says_so_so_the_button_goes(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = started_run(story, "make build")
    story.expect_rows(card(story, process.id)["reader_requested"] is False)
    story.expect_success(f"output ask-reader {process.id} --environment main", actor=story.user)
    story.expect_rows(card(story, process.id)["reader_requested"] is True)


def test_asking_twice_for_the_same_output_is_refused_and_an_agent_cannot_ask(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = started_run(story, "make build")
    story.expect_success(f"output ask-reader {process.id} --environment main", actor=story.user)
    story.expect_refusal(f"output ask-reader {process.id} --environment main", "was asked already", actor=story.user)
    story.expect_refusal(f"output ask-reader {process.id} --environment main", "only a person asks", actor=story.agent)


def test_the_output_dock_may_run_the_line_of_its_button_and_no_other_write(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    lines = story.container.get(WindowLines)
    lines.check("processes.output", ["output", "ask-reader", "1", "--environment", "main"], story.user, "main")
    refused = False
    try:
        lines.check("processes.output", ["message", "send", "hello", "--environment", "main"], story.user, "main")
    except WindowRefusal:
        refused = True
    story.expect_rows(refused)
