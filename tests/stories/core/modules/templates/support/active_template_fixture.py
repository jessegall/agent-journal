import io
import shutil
from pathlib import Path
from uuid import uuid4

import pytest

from engine.caller.caller_request import CallerRequest
from engine.cli.line_run import LineRun
from tests.stories.core.modules.drivers.support.module_memberships import PATH
from tests.stories.core.support.fixtures import UserJoined


@pytest.fixture
def installed_review(new_story, tmp_path):
    story = new_story(f"{PATH}:SuiteModuleJoining", f"{PATH}:AcmeSuiteOfSuiteModule", fixture=UserJoined)
    source = Path(__file__).parent / "acme_review"
    folder = tmp_path / f"acme_review_{uuid4().hex}"
    shutil.copytree(source, folder)
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "add", str(folder)], CallerRequest({}, str(tmp_path), 0), stream)
    story.expect_rows(code == 0)
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.run_listeners()
    story.expect_success("suite choose coding --environment main", actor=story.user)
    story.expect_success("environment make elsewhere /work/elsewhere")
    story.expect_success("suite choose acme --environment elsewhere", actor=story.user)
    return story
