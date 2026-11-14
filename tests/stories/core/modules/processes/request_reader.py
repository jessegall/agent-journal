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
    story.expect_refusal(f"output ask-reader {process.id} --environment main", "only a user asks", actor=story.agent)


