"""Confirm the installer in a scratch project and stop its relay after recording."""

import errno
import fcntl
import json
import os
from pathlib import Path
import pty
import select
import signal
import struct
import sys
import termios
import time


CONFIRMATION = b"Connect this folder? Type yes to go on: "
CONNECT_SECONDS = 120
STOP_SECONDS = 10


def answer_on_terminal(terminal):
    deadline = time.monotonic() + CONNECT_SECONDS
    preceding = b""
    answered = False
    while True:
        remaining = deadline - time.monotonic()
        if remaining <= 0 or not select.select([terminal], [], [], remaining)[0]:
            raise TimeoutError("The recorded project installer did not finish.")
        try:
            received = os.read(terminal, 4096)
        except OSError as error:
            if error.errno == errno.EIO:
                return
            raise
        if not received:
            return
        sys.stdout.buffer.write(received)
        sys.stdout.buffer.flush()
        if answered:
            continue
        observed = preceding + received
        if CONFIRMATION in observed:
            os.write(terminal, b"yes\n")
            answered = True
        preceding = observed[-len(CONFIRMATION):]


def connect(folder, command):
    ticket = os.dup(sys.stdin.fileno())
    child, terminal = pty.fork()
    if child == 0:
        os.chdir(folder)
        os.dup2(ticket, sys.stdin.fileno())
        os.execv(command[0], command)
    os.close(ticket)
    try:
        answer_on_terminal(terminal)
    except BaseException:
        os.kill(child, signal.SIGTERM)
        raise
    finally:
        os.close(terminal)
        _, status = os.waitpid(child, 0)

    exit_code = os.waitstatus_to_exitcode(status)
    # Exit 2 leaves a redeemed connection whose first contact the scenario can wait for.
    return 0 if exit_code == 2 else exit_code


def run_terminal(folder, pid_file, command):
    child, terminal = pty.fork()
    if child == 0:
        os.chdir(folder)
        fcntl.ioctl(sys.stdin.fileno(), termios.TIOCSWINSZ, struct.pack("HHHH", 40, 120, 0, 0))
        os.environ.setdefault("TERM", "xterm-256color")
        os.execv(command[0], command)

    def stop_terminal(signum, _frame):
        os.kill(child, signum)

    signal.signal(signal.SIGTERM, stop_terminal)
    pid_file.write_text(str(os.getpid()))
    try:
        while True:
            try:
                output = os.read(terminal, 4096)
            except OSError as error:
                if error.errno == errno.EIO:
                    break
                raise
            if not output:
                break
            sys.stdout.buffer.write(output)
            sys.stdout.buffer.flush()
    finally:
        os.close(terminal)
        _, status = os.waitpid(child, 0)
        pid_file.unlink(missing_ok=True)
    return os.waitstatus_to_exitcode(status)


def stop(state):
    for connection in state.glob("connections/*"):
        # The relay stops by itself once its scratch binding is gone.
        connection.joinpath("binding.json").unlink(missing_ok=True)
        lock_path = connection / "relay.lock"
        if not lock_path.exists():
            continue
        deadline = time.monotonic() + STOP_SECONDS
        with lock_path.open("rb") as lock:
            while True:
                try:
                    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                    break
                except BlockingIOError:
                    if time.monotonic() >= deadline:
                        raise TimeoutError(f"The recording relay is still running under {state}.")
                    time.sleep(0.1)
    return 0


def binding(folder):
    print(json.loads(Path(folder, ".journal", "connection.json").read_text())["binding"])


if __name__ == "__main__":
    action, *arguments = sys.argv[1:]
    if action == "connect":
        folder, *command = arguments
        sys.exit(connect(folder, command))
    if action == "terminal":
        folder, pid_file, *command = arguments
        sys.exit(run_terminal(folder, Path(pid_file), command))
    if action == "stop":
        sys.exit(stop(Path(arguments[0])))
    if action == "binding":
        sys.exit(binding(arguments[0]))
    sys.exit("The recording relay needs a connect, terminal, stop or binding operation.")
