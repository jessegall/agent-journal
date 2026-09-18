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

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
