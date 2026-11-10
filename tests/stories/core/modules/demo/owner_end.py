import json
import os
import re
import signal
import subprocess
import time

from tests.stories.core.support.fixtures import UserJoined

OWNER_LIFE_SECONDS = 600
SERVER_END_SECONDS = 60


def is_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    return True


def test_the_server_of_a_demo_ends_with_the_process_it_was_started_for(new_story):
    story = new_story(fixture=UserJoined)
    owner = subprocess.Popen(["sleep", str(OWNER_LIFE_SECONDS)])
    outcome = story.run(f"demo start --stop-with {owner.pid} --json", actor=story.user)
    pid = int(re.search(r"server pid (\d+)", json.loads(outcome.output_text)["lines"][0])[1])
    try:
        story.expect_rows(outcome.code == 0, is_alive(pid))
        owner.kill()
        owner.wait(timeout=10)
        deadline = time.monotonic() + SERVER_END_SECONDS
        while is_alive(pid) and time.monotonic() < deadline:
            time.sleep(0.5)
        story.expect_rows(not is_alive(pid))
    finally:
        if is_alive(pid):
            os.kill(pid, signal.SIGTERM)
