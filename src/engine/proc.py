import ctypes
import ctypes.util
import subprocess
import sys
import threading
from dataclasses import dataclass
from pathlib import Path

from engine.keeper import teardown
from install import git_env

GRACE = 1.0
PROC_PIDTBSDINFO = 3


@dataclass(frozen=True)
class Process:
    pid: int
    parent: int
    name: str


class BsdInfo(ctypes.Structure):
    """The kernel's struct proc_bsdinfo, which proc_pidinfo fills for PROC_PIDTBSDINFO."""

    _fields_ = [("flags", ctypes.c_uint32), ("status", ctypes.c_uint32), ("xstatus", ctypes.c_uint32), ("pid", ctypes.c_uint32),
                ("ppid", ctypes.c_uint32), ("uid", ctypes.c_uint32), ("gid", ctypes.c_uint32), ("ruid", ctypes.c_uint32),
                ("rgid", ctypes.c_uint32), ("svuid", ctypes.c_uint32), ("svgid", ctypes.c_uint32), ("rfu", ctypes.c_uint32),
                ("comm", ctypes.c_char * 16), ("name", ctypes.c_char * 32), ("nfiles", ctypes.c_uint32), ("pgid", ctypes.c_uint32),
                ("pjobc", ctypes.c_uint32), ("e_tdev", ctypes.c_uint32), ("e_tpgid", ctypes.c_uint32), ("nice", ctypes.c_int32),
                ("start_tvsec", ctypes.c_uint64), ("start_tvusec", ctypes.c_uint64)]


def from_libproc(pid: int) -> Process | None:
    """A running process's parent and command name, asked of the macOS kernel rather than of ps; nothing when it has gone."""
    info = BsdInfo()
    if LIBPROC.proc_pidinfo(pid, PROC_PIDTBSDINFO, ctypes.c_uint64(0), ctypes.byref(info), ctypes.sizeof(info)) != ctypes.sizeof(info):
        return None
    return Process(pid, info.ppid, info.comm.decode(errors="replace"))


def from_proc_stat(pid: int) -> Process | None:
    """The same, read from Linux's /proc."""
    try:
        line = Path(f"/proc/{pid}/stat").read_text()
    except OSError:
        return None
    head, _, rest = line.rpartition(")")
    return Process(pid, int(rest.split()[1]), head.partition("(")[2])


LIBPROC = ctypes.CDLL(ctypes.util.find_library("proc")) if sys.platform == "darwin" else None
process = from_libproc if LIBPROC else from_proc_stat


def ran(args: list[str], cwd=None, timeout: float = 5, stdin: str | None = None, env: dict | None = None) -> subprocess.CompletedProcess | None:
    try:
        return subprocess.run(args, cwd=cwd, input=stdin, env=env, capture_output=True, text=True, timeout=timeout)
    except (OSError, subprocess.SubprocessError):
        return None


def run(args: list[str], cwd=None, timeout: float = 5, stdin: str | None = None) -> str:
    done = ran(args, cwd, timeout, stdin)
    return done.stdout if done else ""


def git_ran(args: list[str], cwd, timeout: float = 5, stdin: str | None = None) -> subprocess.CompletedProcess | None:
    return ran(["git", *args], cwd, timeout, stdin, git_env())


def git(args: list[str], cwd, timeout: float = 5, stdin: str | None = None) -> str:
    done = git_ran(args, cwd, timeout, stdin)
    return done.stdout if done else ""


class ListingFailed(RuntimeError):
    """A git listing that did not answer: its silence is not an empty list."""

    @classmethod
    def of(cls, args: list[str], cwd) -> "ListingFailed":
        return cls(f"git {' '.join(args[:2])} did not answer in {cwd}")


def git_listed(args: list[str], cwd, timeout: float = 5) -> str:
    """What a git listing printed, for a caller that would take silence as nothing there: a listing that failed or timed out raises."""
    done = git_ran(args, cwd, timeout)
    if done is None or done.returncode != 0:
        raise ListingFailed.of(args, cwd)
    return done.stdout


def nothing_started(group: int) -> None:
    """What a caller that does not need the process group is given in its place."""


def streamed(args: list[str], cwd, timeout: float, on_output, env: dict | None = None, started=nothing_started) -> tuple[int | None, str]:
    try:
        child = subprocess.Popen(args, cwd=cwd, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, start_new_session=True)
    except OSError as error:
        return None, str(error)
    started(child.pid)
    timer = threading.Timer(timeout, teardown, (child.pid, GRACE))
    timer.start()
    output = bytearray()
    try:
        while chunk := child.stdout.read1(65536):
            output.extend(chunk)
            on_output(output.decode(errors="replace"))
        child.wait()
    finally:
        timer.cancel()
    return (None if child.returncode < 0 else child.returncode), output.decode(errors="replace")


def git_blob(cwd, sha: str, timeout: float = 5) -> bytes | None:
    """The bytes of one stored file, exactly as they were, or nothing when this repository does not hold it."""
    try:
        done = subprocess.run(["git", "cat-file", "blob", sha], cwd=cwd, capture_output=True, timeout=timeout, env=git_env())
    except (OSError, subprocess.SubprocessError):
        return None
    return done.stdout if done.returncode == 0 else None


def git_objects(cwd, shas: list[str], timeout: float = 5) -> dict[str, str]:
    if not shas:
        return {}
    try:
        out = subprocess.run(["git", "cat-file", "--batch"], cwd=cwd, input="\n".join(shas).encode() + b"\n", capture_output=True, timeout=timeout, env=git_env()).stdout
    except (OSError, subprocess.SubprocessError):
        return {}
    found, at = {}, 0
    for sha in shas:
        end = out.find(b"\n", at)
        if end < 0:
            break
        head, at = out[at:end].split(), end + 1
        if len(head) < 3:
            continue
        size = int(head[2])
        found[sha] = out[at:at + size].decode(errors="replace")
        at += size + 1
    return found
