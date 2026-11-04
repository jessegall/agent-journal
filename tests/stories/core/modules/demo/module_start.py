import json
import os
from pathlib import Path
import re
import signal

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser_at
from tests.stories.support.story_checks import expect_value_with


def test_a_demo_installs_a_module_and_draws_its_button_on_a_ready_plan(new_story):
    story = new_story(fixture=UserJoined)
    folder = Path(__file__).parent / "support" / "sample_review"
    outcome = story.run(f'demo start --with-module "{folder}" --json', actor=story.user)
    expect_value_with(outcome.output_text, '"lines"')
    story.expect_rows(outcome.code == 0)
    lines = json.loads(outcome.output_text)["lines"]
    pid = int(re.search(r"server pid (\d+)", lines[0])[1])
    try:
        expect_browser_at(lines[1], "demoModule.browser.mjs", [])
    finally:
        os.kill(pid, signal.SIGTERM)
