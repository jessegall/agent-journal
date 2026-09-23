import subprocess
import threading


def ran(args: list[str], cwd=None, timeout: float = 5, stdin: str | None = None, env: dict | None = None) -> subprocess.CompletedProcess | None:
    try:
        return subprocess.run(args, cwd=cwd, input=stdin, env=env, capture_output=True, text=True, timeout=timeout)
    except (OSError, subprocess.SubprocessError):
        return None


def run(args: list[str], cwd=None, timeout: float = 5, stdin: str | None = None) -> str:
    done = ran(args, cwd, timeout, stdin)
    return done.stdout if done else ""


def git(args: list[str], cwd, timeout: float = 5, stdin: str | None = None) -> str:
    return run(["git", *args], cwd, timeout, stdin)


def streamed(args: list[str], cwd, timeout: float, on_output, env: dict | None = None) -> tuple[int | None, str]:
    try:
        child = subprocess.Popen(args, cwd=cwd, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    except OSError as error:
        return None, str(error)
    timer = threading.Timer(timeout, child.kill)
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


def git_objects(cwd, shas: list[str], timeout: float = 5) -> dict[str, str]:
    if not shas:
        return {}
    try:
        out = subprocess.run(["git", "cat-file", "--batch"], cwd=cwd, input="\n".join(shas).encode() + b"\n", capture_output=True, timeout=timeout).stdout
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
