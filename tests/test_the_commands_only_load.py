"""A process that only runs commands wires the commands and the refusers and nothing that listens or handles.

The server relays every event a command line wrote and did not handle, so a process that wired handlers as well
would handle each fact twice: once where the command ran and once in the server. Refusers stay wired (they are
registered with the commands), because a refuser that runs after the write is no hold at all.

The wiring is process-wide, so each load runs in a process of its own.
"""

import json
import subprocess
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / "src"
WIRED = """
import json, sys
sys.path.insert(0, sys.argv[1])
import features
features.load(commands_only=sys.argv[2] == "yes")
from controllers.base import COMMANDS
from engine import bus
from receiving import REGISTERED
kinds = sorted({one.kind for one in REGISTERED.each})
print(json.dumps({"kinds": kinds, "listening": bus.listening(), "commands": sum(len(words) for words in COMMANDS.values())}))
"""


def wired(commands_only: bool) -> dict:
    ran = subprocess.run([sys.executable, "-I", "-c", WIRED, str(SRC), "yes" if commands_only else "no"], capture_output=True, text=True, timeout=120)
    assert ran.returncode == 0, ran.stderr[-600:]
    return json.loads(ran.stdout.strip().splitlines()[-1])


def test_a_commands_only_load_wires_the_commands_and_no_listener_or_handler():
    only = wired(commands_only=True)
    assert not {"listen", "handle", "answer"} & set(only["kinds"]), f"it wired {only['kinds']}"
    assert only["listening"] is False, "a handler is on the bus"
    assert only["commands"] > 0, "no command is wired"


def test_the_full_load_still_wires_the_handlers_the_server_runs():
    full = wired(commands_only=False)
    assert full["listening"] is True, "the full load puts no handler on the bus"
    assert full["commands"] == wired(commands_only=True)["commands"], "the commands are the same in both"
