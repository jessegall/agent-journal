import json
import os
from pathlib import Path
import re
import signal
import pytest

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser_at
from tests.stories.server.support.server_client import request_answer
from tests.stories.support.story_checks import expect_value_with
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


@pytest.mark.parametrize("page_type", ["home", "popout", "phone"])
def test_a_demo_installs_a_module_and_draws_its_button_on_a_ready_plan(new_story, page_type):
    story = new_story(fixture=UserJoined)
    folder = Path(__file__).parent / "support" / "sample_review"
    outcome = story.run(f'demo start --with-module "{folder}" --stop-with {os.getpid()} --json', actor=story.user)
    expect_value_with(outcome.output_text, '"lines"')
    story.expect_rows(outcome.code == 0)
    lines = json.loads(outcome.output_text)["lines"]
    pid = int(re.search(r"server pid (\d+)", lines[0])[1])
    try:
        demo_folder = Path(re.search(r"the demo runs in (.+) \(server pid", lines[0])[1])
        socket = demo_folder / ".journal" / "server.sock"
        request_answer(socket, "POST", "/cli", {"argv": ["setting", "set", f"{TOUR_COMPLETED}", "true", "--project"],
                                               "variables": {"USER": "Demo"}, "folder": str(demo_folder)})
        share = request_answer(socket, "POST", "/cli", {"argv": ["share", "make", "plans:6", "--json"],
                                                       "variables": {"USER": "Demo"}, "folder": str(demo_folder)})
        story.expect_rows(share.exit_code == 0)
        pairing = request_answer(socket, "POST", "/cli", {"argv": ["phone", "pair", "--json"],
                                                         "variables": {"USER": "Demo"}, "folder": str(demo_folder)})
        story.expect_rows(pairing.exit_code == 0)
        expect_browser_at(lines[1], "demoModule.browser.mjs", [json.loads(share.text)["link"], page_type, json.loads(pairing.text)["code"]])
    finally:
        os.kill(pid, signal.SIGTERM)
