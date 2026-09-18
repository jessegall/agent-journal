from __future__ import annotations

import fcntl
import os
import pty
import select
import struct
import sys
import termios
import time

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


# A SHELL UNDER THE LAUNCHER, driven from a pty of this test's own: what is typed reaches it, what
# it prints comes back, the window size passes through, and its exit code is the launcher's.
pid, fd = pty.fork()
if pid == 0:
    import launch
    os._exit(launch.run(["/bin/sh", "-c", "echo READY; read x; echo GOT:$x; stty size; exit 7"]))
fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", 33, 111, 0, 0))
time.sleep(0.3)
os.kill(pid, 28)
out = b""


def drain(seconds: float) -> None:
    global out
    end = time.time() + seconds
    while time.time() < end:
        r, _, _ = select.select([fd], [], [], 0.2)
        if r:
            try:
                out += os.read(fd, 4096)
            except OSError:
                return


drain(0.8)
os.write(fd, b"hello there\r")
drain(1.5)
_, status = os.waitpid(pid, 0)
text = out.decode(errors="replace")
check("what is typed reaches the agent and its answer comes back", "GOT:hello there" in text, True)
check("the window size passes through to the agent", "33 111" in text, True)
check("the agent's exit code is the launcher's", os.waitstatus_to_exitcode(status), 7)

# THE LAUNCHER KNOWS WHAT THE USER HAS ON THE LINE, which is what keeps a nudge from landing mid-word.
import launch  # noqa: E402
seat = launch.Launcher(["true"])
seat._note_typed(b"jour")
check("a half-typed line is noticed", seat.user_mid_line(), True)
seat._note_typed(b"\x7f\x7f")
check("backspace shortens it", seat.typed, b"jo")
seat._note_typed(b"nal\r")
check("Enter clears it", seat.user_mid_line(), False)
seat._note_typed(b"abc\x03")
check("Ctrl-C drops it", seat.typed, b"")

# THE NUDGER TYPES THE VIEWER'S NEWS, ONCE, WHEN THE AGENT IS QUIET. A message left on the environment
# is typed as the record says it; typed once; never over a half-typed line or a busy agent.
import tempfile  # noqa: E402
from pathlib import Path  # noqa: E402
import tracks  # noqa: E402
import inbox  # noqa: E402
root = Path(tempfile.mkdtemp()) / ".journal"
root.mkdir()
tracks.create(root, "alpha", at="2026-09-18T00:00:00+00:00")


class FakeSeat:
    def __init__(self):
        self.lines = []
        self.idle = 10.0
        self.mid = False

    def idle_for(self):
        return self.idle

    def user_mid_line(self):
        return self.mid

    def type_line(self, text):
        self.lines.append(text)


seat = FakeSeat()
nudger = launch.Nudger(root, "alpha", every=0)
nudger.since = 1.0
nudger(seat)
check("nothing waiting, nothing typed", seat.lines, [])
inbox.add(root, "please look at the header", "2026-09-18T00:00:05+00:00", source="web", track="alpha")
seat.idle = 1.0
nudger(seat)
check("a busy agent is not interrupted", seat.lines, [])
seat.idle = 10.0
seat.mid = True
nudger(seat)
check("a half-typed line is not typed over", seat.lines, [])
seat.mid = False
nudger(seat)
check("quiet agent, empty line: the message is typed as the record says it",
      (len(seat.lines), "left message 1" in seat.lines[0], "messages show 1" in seat.lines[0]), (1, True, True))
nudger(seat)
check("and only once", len(seat.lines), 1)

# THE HOOKS' REPORTS ARE THE IDLE SIGNAL when there are any: a Stop means idle, a tool call means not
import json  # noqa: E402
events = root / "runtime" / "events"
events.mkdir(parents=True, exist_ok=True)
(events / "sess-1.jsonl").write_text(json.dumps({"at": time.time(), "event": "PreToolUse", "tool": "Bash", "session": "sess-1"}) + "\n")
inbox.add(root, "and the footer", "2026-09-18T00:00:09+00:00", source="web", track="alpha")
nudger(seat)
check("a session mid tool call is not typed to, however quiet the pty", len(seat.lines), 1)
with (events / "sess-1.jsonl").open("a") as f:
    f.write(json.dumps({"at": time.time(), "event": "Stop", "session": "sess-1"}) + "\n")
seat.idle = 1.5
nudger(seat)
check("a Stop report is idle, and the next message is typed", (len(seat.lines), "left message 2" in seat.lines[-1]), (2, True))

# THE STOP QUEUE IS TYPED FROM OUTSIDE. With the news told, the seat asks the hook's queue what the
# session is owed and types that one line; typed once until the agent is heard from again; the
# user's own Enter makes the next read a fresh one.
import hook  # noqa: E402
asked = []


def fake_nudge(stem, active):
    asked.append((stem, active))
    return "1 untagged message(s)\n  last at line 9; open the next with [!reply]" if len(asked) < 3 else None


hook.nudge_for = fake_nudge
nudger(seat)
check("the message typed a moment ago is not typed over before the hooks report", len(seat.lines), 2)
with (events / "sess-1.jsonl").open("a") as f:
    f.write(json.dumps({"at": time.time(), "event": "Stop", "session": "sess-1"}) + "\n")
nudger(seat)
check("nothing more waiting: the queue is read for the reported session and its line typed on one line",
      (asked[-1], seat.lines[-1]), (("sess-1", False), "1 untagged message(s) last at line 9; open the next with [!reply]"))
nudger(seat)
check("nothing is typed over a line the hooks have not answered yet", len(seat.lines), 3)
with (events / "sess-1.jsonl").open("a") as f:
    f.write(json.dumps({"at": time.time() + 1, "event": "Stop", "session": "sess-1"}) + "\n")
nudger(seat)
check("the agent stopped again: the queue is read as one being answered", asked[-1], ("sess-1", True))
seat.user_lines = 1
with (events / "sess-1.jsonl").open("a") as f:
    f.write(json.dumps({"at": time.time() + 2, "event": "Stop", "session": "sess-1"}) + "\n")
nudger(seat)
check("after the user's own line the read is fresh again", asked[-1], ("sess-1", False))

# THE STOP HOOK STEPS BACK FOR A SEATED SESSION: a fresh seat stamp means the launcher speaks for the queue
import state  # noqa: E402
hook.ROOT = root
check("no stamp: not seated", hook.seated("sess-9"), False)
state.put(root, "seat_seen", int(time.time()), stem="sess-9")
check("stamped just now: seated", hook.seated("sess-9"), True)
state.put(root, "seat_seen", int(time.time()) - 120, stem="sess-9")
check("a stale stamp is no seat", hook.seated("sess-9"), False)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
