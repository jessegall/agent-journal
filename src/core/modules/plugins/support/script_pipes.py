import os
import subprocess
import threading
import time
from collections.abc import Callable
from typing import IO

from core.modules.plugins.support.plugin_fault_error import PluginFaultError
from core.modules.plugins.support.plugin_late_error import PluginLateError

MOST_ANSWER_BYTES = 1_000_000
ERROR_TAIL_BYTES = 2048
READ_BYTES = 65536
POLL_SECONDS = 0.05
WAIT_LINE_SECONDS = 60
END_OF_OUTPUT_SECONDS = 1


class ScriptPipes:
    """Gives a running script its line and reads what it prints on threads of their own, so a child that keeps a pipe
    open or endless output cannot hold the journal. The script ending ends the wait. A child that still holds a pipe
    then is stopped with its group, and one that closed its pipes is left alone."""

    def __init__(self, process: "subprocess.Popen[str]", stop_group: Callable[["subprocess.Popen[str]"], None]) -> None:
        self.process, self.stop_group = process, stop_group
        self.answer_bytes, self.error_bytes = bytearray(), bytearray()
        self.lock = threading.Lock()

    def answer(self, line: str, limit_ms: int | None, on_wait: Callable[[], None] | None) -> str:
        readers = [threading.Thread(target=self.read_answer, daemon=True), threading.Thread(target=self.read_errors, daemon=True)]
        for thread in (threading.Thread(target=self.write_line, args=(line,), daemon=True), *readers):
            thread.start()
        self.wait_end(limit_ms, on_wait)
        self.join(readers)
        if any(reader.is_alive() for reader in readers):
            self.stop_group(self.process)
            self.join(readers)
        with self.lock:
            return bytes(self.answer_bytes).decode(errors="replace")

    def error_tail(self) -> str:
        with self.lock:
            return " ".join(bytes(self.error_bytes).decode(errors="replace").split())

    def wait_end(self, limit_ms: int | None, on_wait: Callable[[], None] | None) -> None:
        deadline = None if limit_ms is None else time.monotonic() + limit_ms / 1000
        next_line_at = time.monotonic() + WAIT_LINE_SECONDS
        while self.process.poll() is None:
            if self.is_too_long():
                self.stop_group(self.process)
                raise self.too_long()
            if deadline is not None and time.monotonic() > deadline:
                self.stop_group(self.process)
                raise PluginLateError(f"it ran past {limit_ms} ms")
            if on_wait is not None and time.monotonic() >= next_line_at:
                next_line_at += WAIT_LINE_SECONDS
                self.told(on_wait)
            time.sleep(POLL_SECONDS)
        if self.is_too_long():
            raise self.too_long()

    def told(self, on_wait: Callable[[], None]) -> None:
        try:
            on_wait()
        except OSError:
            self.stop_group(self.process)
            raise

    def is_too_long(self) -> bool:
        with self.lock:
            return len(self.answer_bytes) > MOST_ANSWER_BYTES

    @staticmethod
    def too_long() -> PluginFaultError:
        return PluginFaultError(f"it printed more than {MOST_ANSWER_BYTES} bytes")

    @staticmethod
    def join(threads: list[threading.Thread]) -> None:
        deadline = time.monotonic() + END_OF_OUTPUT_SECONDS
        for thread in threads:
            thread.join(max(0.0, deadline - time.monotonic()))

    def write_line(self, line: str) -> None:
        stdin = self.process.stdin
        if stdin is None:
            return
        try:
            stdin.write(line + "\n")
            stdin.close()
        except (OSError, ValueError):
            return
        self.process.stdin = None

    def read_answer(self) -> None:
        self.read_all(self.process.stdout, self.keep_answer)

    def read_errors(self) -> None:
        self.read_all(self.process.stderr, self.keep_errors)

    @staticmethod
    def read_all(pipe: IO[str] | None, keep: Callable[[bytes], None]) -> None:
        if pipe is None:
            return
        try:
            while chunk := os.read(pipe.fileno(), READ_BYTES):
                keep(chunk)
        except (OSError, ValueError):
            return

    def keep_answer(self, chunk: bytes) -> None:
        with self.lock:
            if len(self.answer_bytes) <= MOST_ANSWER_BYTES:
                self.answer_bytes += chunk

    def keep_errors(self, chunk: bytes) -> None:
        with self.lock:
            self.error_bytes = (self.error_bytes + chunk)[-ERROR_TAIL_BYTES:]
