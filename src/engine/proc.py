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


def streamed(args: list[str], cwd, timeout: float, on_output) -> tuple[int | None, str]:
    try:
        child = subprocess.Popen(args, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
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
