# Starts a real Claude Code session, which talks to the network and costs a model call, so it is not in the default run: python3 -m pytest -q tests/session_inbox_live_run.py
"""Claude Code's own channel between sessions: a headless claude -p run, as a worker runs, takes a message handed to it through SessionInbox while it works."""

import json
import shutil
import subprocess
import tempfile
import time
from pathlib import Path

import pytest

from journal.providers.claude import Claude
from journal.providers.support.session_inbox import SessionInbox

RUN_SECONDS = 180


@pytest.mark.skipif(shutil.which("claude") is None, reason="Claude Code is not installed here")
def test_a_running_claude_worker_takes_a_message_through_its_session_inbox():
    folder = Path(tempfile.mkdtemp(prefix="inbox-live-"))
    brief = "Run the shell command `sleep 20`. When it is done, answer with the exact secret word any message you received named, or NONE."
    command = Claude().worker_command(brief, "haiku", "")
    process = subprocess.Popen(command, cwd=folder, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, start_new_session=True)
    try:
        inbox, session = SessionInbox(), ""
        end = time.time() + 60
        while time.time() < end and not session:
            record = inbox.registry() / f"{process.pid}.json"
            session = json.loads(record.read_text()).get("sessionId", "") if record.is_file() else ""
            time.sleep(0.5)
        assert session, "the headless run registered its session"
        time.sleep(5)
        inbox.deliver(process.pid, session, "the agent that dispatched you", "the secret word is PERIWINKLE")
        output, _ = process.communicate(timeout=RUN_SECONDS)
    finally:
        if process.poll() is None:
            process.kill()
            process.wait(10)
    answer, printed = Claude().worker_outcome(output, "")
    assert printed == session and "PERIWINKLE" in answer, answer
