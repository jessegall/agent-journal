import os
import subprocess
import threading
import math
import time
from collections.abc import Callable
from typing import IO

from core.modules.plugins.errors.plugin_fault_error import PluginFaultError
from core.modules.plugins.errors.plugin_late_error import PluginLateError
from engine.time.polled_wait import PolledWait

MOST_ANSWER_BYTES = 1_000_000
ERROR_TAIL_BYTES = 2048
READ_BYTES = 65536
PIPE_POLL_SECONDS = 0.05
WAIT_LINE_SECONDS = 60
OUTPUT_JOIN_SECONDS = 1


class ScriptPipes:
    """Writes script input and reads output without waiting indefinitely for open pipes."""

    def __init__(self, process: "subprocess.Popen[str]", stop_group: Callable[["subprocess.Popen[str]"], None]) -> None:
        self.process, self.stop_group = process, stop_group
        self.answer_bytes, self.error_bytes = bytearray(), bytearray()
        self.lock = threading.Lock()
        self.next_line_at = 0.0

    def answer(self, line: str, limit_ms: int | None, wait_callback: Callable[[], None] | None) -> str:
        readers = [threading.Thread(target=self.read_answer, daemon=True), threading.Thread(target=self.read_errors, daemon=True)]
        for thread in (threading.Thread(target=self.write_line, args=[line], daemon=True), *readers):
            thread.start()
        self.wait_end(limit_ms, wait_callback)
        self.join(readers)
        if any(reader.is_alive() for reader in readers):
            self.stop_group(self.process)
            self.join(readers)
        with self.lock:
            return bytes(self.answer_bytes).decode(errors="replace")

    def error_tail(self) -> str:
        with self.lock:
            return " ".join(bytes(self.error_bytes).decode(errors="replace").split())

    def wait_end(self, limit_ms: int | None, wait_callback: Callable[[], None] | None) -> None:
        self.next_line_at = time.monotonic() + WAIT_LINE_SECONDS
        limit_seconds = math.inf if limit_ms is None else limit_ms / 1000
        if not PolledWait(limit_seconds, PIPE_POLL_SECONDS).poll(lambda: self.has_ended(wait_callback)):
            self.stop_group(self.process)
            raise PluginLateError(f"it ran past {limit_ms} ms")
        if self.exceeds_answer_limit():
            raise self.answer_limit_error()

    def has_ended(self, wait_callback: Callable[[], None] | None) -> bool:
        if self.process.poll() is not None:
            return True
        if self.exceeds_answer_limit():
            self.stop_group(self.process)
            raise self.answer_limit_error()
        if wait_callback is not None and time.monotonic() >= self.next_line_at:
            self.next_line_at += WAIT_LINE_SECONDS
            self.notify_wait(wait_callback)
        return False

    def notify_wait(self, wait_callback: Callable[[], None]) -> None:
        try:
            wait_callback()
        except OSError:
            self.stop_group(self.process)
            raise

    def exceeds_answer_limit(self) -> bool:
        with self.lock:
            return len(self.answer_bytes) > MOST_ANSWER_BYTES

    @staticmethod
    def answer_limit_error() -> PluginFaultError:
        return PluginFaultError(f"it printed more than {MOST_ANSWER_BYTES} bytes")

    @staticmethod
    def join(threads: list[threading.Thread]) -> None:
        deadline = time.monotonic() + OUTPUT_JOIN_SECONDS
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
            while data := os.read(pipe.fileno(), READ_BYTES):
                keep(data)
        except (OSError, ValueError):
            return

    def keep_answer(self, data: bytes) -> None:
        with self.lock:
            if len(self.answer_bytes) <= MOST_ANSWER_BYTES:
                self.answer_bytes += data

    def keep_errors(self, data: bytes) -> None:
        with self.lock:
            self.error_bytes = (self.error_bytes + data)[-ERROR_TAIL_BYTES:]
