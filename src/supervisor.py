import fcntl
import hashlib
import json
import os
import pty
import re
import select
import signal
import socket
import struct
import subprocess
import sys
import termios
import time
import tty
from dataclasses import dataclass, field
from pathlib import Path

RELOAD, STOP, RELAUNCH, HEAL = 75, 76, 77, 78
QUICK = 30.0
GRACE, STEP = 3.0, 0.05
EXITING = 8.0
CLEAR_LINE = b"\x05\x15"
LONGEST = 65536
TYPED_EVERY = 1.0
ESCAPES = re.compile(rb"\x1b(?:\[[\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e]|\][^\x07\x1b]*(?:\x07|\x1b\\)|[P_^X][^\x1b]*\x1b\\|O[\x40-\x7e]|[@-_])")


def typing(data: bytes) -> bool:
    return any(byte >= 0x20 for byte in ESCAPES.sub(b"", data))


def stop(pid: int, grace: float = GRACE, drain=lambda: None) -> int:
    for sent in (signal.SIGHUP, signal.SIGTERM, signal.SIGKILL):
        try:
            os.kill(pid, sent)
        except ProcessLookupError:
            break
        until = time.time() + grace
        while time.time() < until:
            drain()
            ended, status = os.waitpid(pid, os.WNOHANG)
            if ended:
                return status
            time.sleep(STEP)
    try:
        return os.waitpid(pid, 0)[1]
    except ChildProcessError:
        return 0


@dataclass(frozen=True)
class Adopted:
    pid: int
    fd: int
    session: str
    saved: list | None

    @classmethod
    def from_json(cls, raw: dict) -> "Adopted":
        kept = raw["saved"]
        saved = [*kept[:6], [bytes.fromhex(c) if isinstance(c, str) else c for c in kept[6]]] if kept else None
        return cls(raw["pid"], raw["fd"], raw["session"], saved)


@dataclass(frozen=True)
class Start:
    command: list = field(default_factory=list)
    environ: dict = field(default_factory=dict)
    launch: int = 0
    exit: str = ""

    @classmethod
    def from_json(cls, raw: dict) -> "Start":
        return cls(**{key: raw[key] for key in ("command", "environ", "launch", "exit") if key in raw}) if "command" in raw else cls()


@dataclass(frozen=True)
class Launch:
    root: Path
    cwd: Path
    env: str
    agent: str
    worker: list
    heal: list
    ended: list
    args: list
    start: Start
    adopt: Adopted | None

    @classmethod
    def from_json(cls, raw: dict) -> "Launch":
        return cls(Path(raw["root"]), Path(raw["cwd"]), raw["env"], raw["agent"], raw["worker"], raw["heal"], raw["ended"], raw["args"],
                   Start.from_json(raw), Adopted.from_json(raw["adopt"]) if "adopt" in raw else None)


class Supervisor:
    def __init__(self, spec: Launch):
        self.root, self.cwd = spec.root, spec.cwd
        self.env, self.agent = spec.env, spec.agent
        self.worker_command, self.heal_command, self.ended_command = spec.worker, spec.heal, spec.ended
        self.stdin, self.stdout = sys.stdin.fileno(), sys.stdout.fileno()
        adopted = spec.adopt
        self.saved = adopted.saved if adopted else None
        self.pid, self.fd = (adopted.pid, adopted.fd) if adopted else self.spawn(spec.start.command, spec.start.environ)
        self.session = adopted.session if adopted else f"{self.agent}-{self.pid}"
        self.command, self.args, self.launch, self.exit = spec.start.command, spec.args, spec.start.launch, spec.start.exit
        self.worker = None
        self.worker_began = 0.0
        self.alive, self.lifeline = os.pipe()
        os.set_inheritable(self.alive, True)
        self.folder = self.root / "runtime" / "sessions" / self.session
        self.folder.mkdir(parents=True, exist_ok=True)
        self.printed = (self.folder / "printed").open("ab")
        self.screen = (self.folder / "screen").open("ab")
        self.inbox = self.listen()
        self.typed_at = 0.0
        self.record_launch()
        self.resize(self.fd)

    def record_launch(self) -> None:
        (self.folder / "launched.json").write_text(json.dumps({"pid": self.pid, "command": self.command, "args": self.args, "cwd": str(self.cwd), "launch": self.launch}))

    def spawn(self, command: list[str], environ: dict) -> tuple[int, int]:
        pid, fd = pty.fork()
        if pid == 0:
            os.chdir(self.cwd)
            os.execvpe(command[0], command, environ)
        return pid, fd

    def socket_path(self) -> Path:
        return Path("/tmp") / f"journal-{hashlib.sha1(str(self.root.resolve()).encode()).hexdigest()[:16]}" / f"typist-{self.session}.sock"

    def listen(self) -> socket.socket:
        where = self.socket_path()
        where.parent.mkdir(parents=True, exist_ok=True)
        where.unlink(missing_ok=True)
        inbox = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
        inbox.bind(str(where))
        inbox.setblocking(False)
        return inbox

    def received(self) -> list[bytes]:
        packets = []
        while True:
            try:
                packets.append(self.inbox.recv(LONGEST))
            except (BlockingIOError, InterruptedError):
                return packets

    def resize(self, fd: int) -> None:
        try:
            size = fcntl.ioctl(self.stdout, termios.TIOCGWINSZ, b"\0" * 8)
            fcntl.ioctl(fd, termios.TIOCSWINSZ, size)
            rows, cols = struct.unpack("HHHH", size)[:2]
        except OSError:
            return
        (self.folder / "screen.json").write_text(json.dumps({"rows": rows, "cols": cols, "at": self.screen.tell(), "printed": self.printed.tell()}))

    def start_worker(self) -> None:
        command = [*self.worker_command, str(self.root), str(self.cwd), self.env, self.agent, self.session, str(self.alive)]
        self.worker = subprocess.Popen(command, cwd=self.cwd, pass_fds=(self.alive,))
        self.worker_began = time.time()

    def worker_ended(self) -> int | None:
        return self.worker.poll() if self.worker else None

    def stop_agent(self) -> int:
        status = self.exited()
        return stop(self.pid, drain=self.drain) if status is None else status

    def exited(self) -> int | None:
        if not self.exit:
            return None
        try:
            os.write(self.fd, CLEAR_LINE)
            time.sleep(STEP)
            os.write(self.fd, self.exit.encode())
            time.sleep(STEP * 6)
            os.write(self.fd, b"\r")
        except OSError:
            return None
        until = time.time() + EXITING
        while time.time() < until:
            self.drain()
            ended, status = os.waitpid(self.pid, os.WNOHANG)
            if ended:
                return status
            time.sleep(STEP)
        return None

    def drain(self) -> None:
        while select.select([self.fd], [], [], 0)[0]:
            try:
                data = os.read(self.fd, LONGEST)
            except OSError:
                return
            if not data:
                return
            self.output(data)

    def relaunch(self) -> None:
        asked = self.folder / "relaunch.json"
        start = Start.from_json(json.loads(asked.read_text()))
        asked.unlink()
        self.stop_agent()
        os.close(self.fd)
        self.pid, self.fd = self.spawn(start.command, start.environ)
        self.command, self.launch, self.exit = start.command, start.launch, start.exit
        self.record_launch()
        self.resize(self.fd)

    def stop_worker(self) -> None:
        if self.worker and self.worker.poll() is None:
            self.worker.terminate()
            self.worker.wait()

    def relay(self) -> int | None:
        ready, _, _ = select.select([self.fd, self.stdin, self.inbox], [], [], 0.5)
        if self.inbox in ready:
            for raw in self.received():
                os.write(self.fd, raw)
        if self.fd in ready:
            try:
                data = os.read(self.fd, LONGEST)
            except OSError:
                data = b""
            if not data:
                return os.waitpid(self.pid, 0)[1]
            self.output(data)
        if self.stdin in ready:
            data = os.read(self.stdin, LONGEST)
            if not data:
                return self.stop_agent()
            os.write(self.fd, data)
            self.typing(data)
        return None

    def output(self, data: bytes) -> None:
        os.write(self.stdout, data)
        self.screen.write(data)
        self.screen.flush()
        self.printed.write(data)
        self.printed.flush()

    def typing(self, data: bytes) -> None:
        typed = self.folder / "typed"
        if b"\r" in data or b"\n" in data:
            typed.unlink(missing_ok=True)
        elif typing(data) and time.time() - self.typed_at >= TYPED_EVERY:
            typed.touch()
            self.typed_at = time.time()

    def delegate(self, command: list[str]) -> str:
        done = subprocess.run(command, cwd=self.cwd, capture_output=True, text=True, timeout=120)
        if done.returncode:
            os.write(self.stdout, f"\r\njournal: {' '.join(command[-2:])} failed: {done.stderr.strip()[-400:]}\r\n".encode())
        return done.stdout.strip()

    def after_worker(self, code: int) -> int | None:
        if code == STOP:
            return self.stop_agent()
        if code == RELAUNCH:
            self.relaunch()
        elif code == HEAL or (code != RELOAD and time.time() - self.worker_began < QUICK):
            line = self.delegate(self.heal_command)
            if line:
                os.write(self.stdout, f"\r\n{line}\r\n".encode())
        self.start_worker()
        return None

    def run(self) -> int:
        saved = self.saved
        try:
            saved = saved or termios.tcgetattr(self.stdin)
            tty.setraw(self.stdin)
        except termios.error:
            pass
        signal.signal(signal.SIGWINCH, lambda *_: self.resize(self.fd))
        signal.signal(signal.SIGHUP, lambda *_: sys.exit(129))
        signal.signal(signal.SIGTERM, lambda *_: sys.exit(143))
        status = None
        self.start_worker()
        try:
            while status is None:
                status = self.relay()
                code = self.worker_ended()
                if status is None and code is not None:
                    status = self.after_worker(code)
        finally:
            self.stop_worker()
            if status is None:
                status = self.stop_agent()
            if saved is not None:
                termios.tcsetattr(self.stdin, termios.TCSADRAIN, saved)
            self.inbox.close()
            self.socket_path().unlink(missing_ok=True)
            self.delegate(self.ended_command)
        return os.waitstatus_to_exitcode(status)


if __name__ == "__main__":
    sys.exit(Supervisor(Launch.from_json(json.loads(sys.argv[1]))).run())
