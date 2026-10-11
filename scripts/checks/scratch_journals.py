import os
import re
import signal
import subprocess
import sys
import time
from dataclasses import dataclass

SCRATCH = re.compile(r"/(pytest-of-[^/\s]+|agent-journal-[^/\s]+)/")
OWNER = re.compile(r"AGENT_JOURNAL_TEST_OWNER=(\d+)")
RUNNING = re.compile(r"journal|supervisor|serve|keeper|worker")
LONGEST = 30 * 60
GRACE = 1.0


@dataclass(frozen=True)
class Scratch:
    pid: int
    seconds: int
    command: str

    def owner(self) -> int:
        shown = subprocess.run(["ps", "-wwE", "-p", str(self.pid), "-o", "command="], capture_output=True, text=True, timeout=10).stdout
        found = OWNER.search(shown)
        return int(found.group(1)) if found else 0

    def orphaned(self) -> bool:
        """Whether its test has ended: the test it names is gone, or it names none and has outlived any test."""
        owner = self.owner()
        return not alive(owner) if owner else self.seconds > LONGEST

    def line(self) -> str:
        return f"{self.pid} has run {self.seconds // 60} minutes: {self.command[:160]}"


def alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except PermissionError:
        return True
    except OSError:
        return False
    return True


def seconds(elapsed: str) -> int:
    days, _, clock = elapsed.rpartition("-")
    parts = [int(part) for part in clock.split(":")]
    hours, minutes, last = ([0] * (3 - len(parts))) + parts
    return int(days or 0) * 86400 + hours * 3600 + minutes * 60 + last


def processes() -> list[Scratch]:
    listed = subprocess.run(["ps", "-axwwo", "pid=,etime=,command="], capture_output=True, text=True, timeout=30).stdout.splitlines()
    found = []
    for line in listed:
        pid, elapsed, command = (line.split(None, 2) + ["", ""])[:3]
        if pid.isdigit() and int(pid) != os.getpid() and SCRATCH.search(command) and RUNNING.search(command) and "scratch_journals" not in command:
            found.append(Scratch(int(pid), seconds(elapsed), command))
    return found


def ended(found: list[Scratch]) -> None:
    for each in found:
        try:
            os.kill(each.pid, signal.SIGTERM)
        except OSError:
            continue
    time.sleep(GRACE)
    for each in found:
        if alive(each.pid):
            try:
                os.kill(each.pid, signal.SIGKILL)
            except OSError:
                continue


if __name__ == "__main__":
    orphans = [each for each in processes() if each.orphaned()]
    ended(orphans)
    print("\n".join(f"killed a scratch journal whose test is gone: {each.line()}" for each in orphans) or "no scratch journal outlives its test")
    sys.exit(1 if orphans else 0)
