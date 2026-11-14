import json
import shutil
from pathlib import Path

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.engine.driver.support.fixtures import SampleSuiteChoice
from tests.stories.engine.driver.support.samples import SAMPLES
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

    def open_main_numbers(self) -> list[int]:
        rows = json.loads(self.server.story.run(f"agent list --environment {ENVIRONMENT} --oldest --limit 1000 --json").output_text)["rows"]
        return [row["number"] for row in rows if row["role"] == "main" and row["ended_at"] is None]

    def expect_one_main_agent(self) -> None:
        self.server.story.expect_rows(len(self.open_main_numbers()) == 1)


@pytest.fixture
def launched(new_story, tmp_path):
    with server_story(new_story(SAMPLES, fixture=SampleSuiteChoice)) as server:
        yield LaunchedEnvironment(server, tmp_path)


@pytest.fixture
def first_launch(launched):
    with launched.launch() as first:
        first.expect_menu_program()
        launched.expect_one_main_agent()
        yield first


def test_a_launch_goes_on_over_a_killed_launcher_with_one_main_agent_open(launched, first_launch):
    first_launch.kill_launcher()
    with launched.launch() as second:
        second.expect_stopping_running_main_program()
        second.expect_running()
        launched.expect_one_main_agent()


def test_the_viewer_stop_ends_a_launched_main_and_its_launch(launched):
    story = launched.server.story
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    with launched.launch() as launch:
        launch.expect_menu_program()
        main_number = launched.open_main_numbers()[0]
        cookie = launched.server.expect_viewer_login(launched.server.viewer_key("Ada"))
        body = {"window": "viewer.shell", "line": ["agent", "stop", str(main_number)], "environment": ENVIRONMENT}
        launched.server.expect_viewer_line(cookie, body, 200, '"code": 0')
        launch.expect_ended()
        story.expect_rows(launched.open_main_numbers() == [])
