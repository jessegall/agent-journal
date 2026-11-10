import io
import shutil
from pathlib import Path
from uuid import uuid4

import pytest

from engine.caller.caller_request import CallerRequest
from engine.cli.line_run import LineRun
from core.testing.story import Story
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import ServerStory, server_story, viewer_answer
from tests.stories.support.story_checks import expect_value, expect_value_with


def added_package(story: Story, tmp_path: Path, package: str) -> None:
    source = Path(__file__).parent / package
    folder = tmp_path / f"{package}_{uuid4().hex}"
    shutil.copytree(source, folder)
    if (folder / "web").is_dir():
        (folder / "web/dist").mkdir()
        for script in (folder / "web").glob("*.js"):
            shutil.copyfile(script, folder / "web/dist" / script.name)
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "add", str(folder)], CallerRequest({"USER": "Ada"}, "/", 0), stream)
    expect_value_with(stream.getvalue(), "modules:")
    story.expect_rows(code == 0)


def added_packages(new_story, tmp_path: Path, *packages: str) -> Story:
    story = new_story(SAMPLES, fixture=UserJoined)
    for package in packages:
        added_package(story, tmp_path, package)
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.run_listeners()
    story.expect_success('plan make "Cart security" --environment main')
    story.expect_success("plan ready 1")
    return story


@pytest.fixture
def third_party(new_story, tmp_path):
    with server_story(added_packages(new_story, tmp_path, "acme_review", "acme_suite", "acme_findings", "acme_legal")) as server:
        yield server


@pytest.fixture
def third_party_cookie(third_party):
    return third_party.expect_viewer_login(third_party.viewer_key("Ada"))


@pytest.fixture
def plan_notes(new_story, tmp_path):
    with server_story(added_packages(new_story, tmp_path, "acme_plan_notes", "acme_sections")) as server:
        yield server


@pytest.fixture
def plan_notes_cookie(plan_notes: ServerStory) -> str:
    return plan_notes.expect_viewer_login(plan_notes.viewer_key("Ada"))


def viewer_body(server, path, cookie) -> str:
    status, _, body = viewer_answer(server.viewer_port(), path, cookie, "")
    expect_value(status, 200)
    return body
