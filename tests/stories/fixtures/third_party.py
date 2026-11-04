import io
import shutil
from pathlib import Path
from uuid import uuid4

import pytest

from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.support.story_checks import expect_value, expect_value_with


@pytest.fixture
def third_party(new_story, tmp_path):
    story = new_story(SAMPLES, fixture=UserJoined)
    for package in ("acme_review", "acme_suite", "acme_findings", "acme_legal"):
        source = Path(__file__).parent / package
        folder = tmp_path / f"{package}_{uuid4().hex}"
        shutil.copytree(source, folder)
        if package == "acme_findings":
            (folder / "web/dist").mkdir()
            shutil.copyfile(folder / "web/findings.js", folder / "web/dist/findings.js")
        stream = io.StringIO()
        code = LineRun(story.home).run(["module", "add", str(folder)], CallerRequest({"USER": "Ada"}, "/", 0), stream)
        expect_value_with(stream.getvalue(), "modules:")
        story.expect_rows(code == 0)
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.run_listeners()
    story.expect_success('plan make "Cart security" --environment main')
    story.expect_success("plan ready 1")
    with server_story(story) as server:
        yield server


@pytest.fixture
def third_party_cookie(third_party):
    return third_party.expect_viewer_login(third_party.viewer_key("Ada"))


def viewer_body(server, path, cookie) -> str:
    status, _, body = viewer_answer(server.viewer_port(), path, cookie, "")
    expect_value(status, 200)
    return body
