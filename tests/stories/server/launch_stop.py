import json
import shutil
from pathlib import Path

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.server.support.launch_terminal import LaunchTerminal, fake_programs
from tests.stories.server.support.server_client import ServerStory, server_story

pytestmark = pytest.mark.skipif(shutil.which("go") is None, reason="the Go client needs go to build")

ENVIRONMENT = "launched"
SUITE = "samples"


class LaunchedEnvironment:
    """A real server on a story's journal, with an environment in a folder that exists, and real launches in it."""

    def __init__(self, server: ServerStory, tmp_path: Path) -> None:
        self.server, self.folder, self.binary = server, tmp_path / "project", tmp_path / "journal-client"
        self.folder.mkdir()
        self.programs = fake_programs(tmp_path / "programs")
        server.story.run(f"environment make {ENVIRONMENT} {self.folder}")
        server.story.run(f"suite choose {SUITE} --environment {ENVIRONMENT}")
        self.suite_number = server.story.run("suite list").output_text.split().index(SUITE) + 1

    def launch(self) -> LaunchTerminal:
        return LaunchTerminal(self.server.story.home, self.binary, self.programs, self.folder, self.suite_number)

    def open_main_ids(self) -> list[int]:
        rows = json.loads(self.server.story.run(f"agent list --environment {ENVIRONMENT} --oldest --limit 1000 --json").output_text)["rows"]
        return [row["id"] for row in rows if row["role"] == "main" and row["ended_at"] is None]

    def expect_main_row_replaced(self, old_rows: list[int]) -> None:
        rows = self.open_main_ids()
        self.server.story.expect_rows(len(rows) == 1, rows != old_rows)


@pytest.fixture
def launched(new_story, tmp_path):
    with server_story(new_story(SAMPLES, fixture=SampleSuiteChoice)) as server:
        yield LaunchedEnvironment(server, tmp_path)


@pytest.fixture
def first_launch(launched):
    with launched.launch() as first:
        first.expect_menu_program()
        first_rows = launched.open_main_ids()
        launched.server.story.expect_rows(len(first_rows) == 1)
        yield first, first_rows


def test_a_second_launch_in_an_environment_stops_the_first_and_starts_its_own_program(launched, first_launch):
    first, first_rows = first_launch
    with launched.launch() as second:
        second.expect_stopping_running_main_program()
        first.expect_ended()
        second.expect_running()
        launched.expect_main_row_replaced(first_rows)


def test_a_launch_goes_on_over_a_killed_launcher_with_the_old_row_ended(launched, first_launch):
    first, first_rows = first_launch
    first.kill_launcher()
    with launched.launch() as second:
        second.expect_stopping_running_main_program()
        second.expect_running()
        launched.expect_main_row_replaced(first_rows)


def test_the_viewer_stop_ends_a_launched_main_and_its_launch(launched):
    story = launched.server.story
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    with launched.launch() as launch:
        launch.expect_menu_program()
        main_id = launched.open_main_ids()[0]
        cookie = launched.server.expect_viewer_login(launched.server.viewer_key("Ada"))
        body = {"window": "viewer.shell", "line": ["agent", "stop", str(main_id)], "environment": ENVIRONMENT}
        launched.server.expect_viewer_line(cookie, body, 200, '"code": 0')
        launch.expect_ended()
        story.expect_rows(launched.open_main_ids() == [])


def test_two_launches_at_once_end_with_one_main_and_the_first_launch_ended(launched):
    with launched.launch() as first, launched.launch() as second:
        first.last_question_wait()
        second.last_question_wait()
        first.expect_last_question_program()
        second.expect_last_question_program()
        first.expect_ended()
        second.expect_running()
        launched.server.story.expect_rows(len(launched.open_main_ids()) == 1)

