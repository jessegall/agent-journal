import queue
import threading
import time
from pathlib import Path
from typing import Iterator

from journal.config import Config
from journal.features.shell.support.cap import Cap
from journal.features.shell.support.chain_worker import ChainWorker
from journal.features.shell.support.foreground_limit import ForegroundLimit
from journal.features.shell.support.output_cap import OutputCap
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_show import OutputShow
from journal.features.shell.support.shell_record import ShellRecord
from journal.features.shell.support.shell_request import ShellRequest
from journal.support.chain import Chain
from journal.support.scope import Scope
from journal.support.where import Where

EXIT = "__journal_exit"
"""The stream's last line: the chain's exit code, which the shim ends with."""
TICK = 0.2
LIMIT_READ_EVERY = 10


class ShellRunner:
    """Runs one shell line for the shim and streams back what the agent sees: the line is split into its parts, run in the user's shell by the worker, each part shown as its status lands and the cap says, the chain moved to the background past the foreground limit with a line naming its output, and an ended output kept under its number or forgotten. A read or write of the project's code streams straight through, nothing kept. The stream is read after the request has left its scope, so the environment comes along and is named again for every read and write; the exit line starts on a line of its own."""

    def __init__(self, config: Config, caps: OutputCap, limits: ForegroundLimit, worker: ChainWorker, record: ShellRecord, scope: Scope) -> None:
        self.config, self.caps, self.limits, self.worker, self.record, self.scope = config, caps, limits, worker, record, scope

    def run(self, request: ShellRequest, where: Where, environment: int) -> Iterator[bytes]:
        with self.scope.of(environment):
            cap = self.caps.of(request.line)
            folder = OutputFiles(self.config.home / "runtime" / "outputs" / f"{int(time.time())}-{threading.get_ident()}")
            folder.split_into(request.line, Chain.parts(request.line))
            if not cap.is_whole() and not cap.is_direct():
                folder.numbered(self.record.began(folder.folder.name, "\n".join(p.text for p in Chain.parts(request.line) if p.recorded), folder.folder, where))
        printed: queue.Queue = queue.Queue()
        ended: list[int] = []
        thread = threading.Thread(target=lambda: self.worked(folder, request, where, cap.is_direct(), printed, ended, environment), name="shell-chain", daemon=True)
        thread.start()
        last = b"\n"
        with self.scope.of(environment):
            for block in (self.direct(printed, thread) if cap.is_direct() else self.foreground(folder, request, where, cap)):
                last = block[-1:] or last
                yield block
        if cap.is_direct() or folder.is_done():
            self.closed(folder, request, where, cap)
            yield f"{'' if last == b'\n' else chr(10)}{EXIT} {ended[0] if ended else 0}\n".encode()

    def worked(self, folder: OutputFiles, request: ShellRequest, where: Where, direct: bool, printed: queue.Queue, ended: list[int], environment: int) -> None:
        with self.scope.of(environment):
            ended.append(self.worker.run(folder, request, where, direct, printed.put))
        printed.put(None)

    @staticmethod
    def direct(printed: queue.Queue, thread: threading.Thread) -> Iterator[bytes]:
        while True:
            block = printed.get()
            if block is None:
                thread.join()
                return
            yield block

    def foreground(self, folder: OutputFiles, request: ShellRequest, where: Where, cap: Cap) -> Iterator[bytes]:
        show = OutputShow(folder, cap)
        limit = self.limits.of(request.line, where.environment)
        shown, tick, began = 0, 0, time.monotonic()
        while True:
            while folder.has_ended(shown):
                yield show.of(shown).encode()
                shown += 1
            if folder.is_done():
                return
            if limit > 0 and time.monotonic() - began >= limit:
                folder.moved()
                number = self.record.moved(folder.folder.name, folder.part_text(shown), folder.folder, where)
                from journal.features.shell.feature import Shell
                yield f"{Shell.MOVED_TO_THE_BACKGROUND.create(n=number, file=str(folder.folder)).rendered()}\n{EXIT} 0\n".encode()
                return
            time.sleep(TICK)
            tick += 1
            if tick % LIMIT_READ_EVERY == 0:
                limit = self.limits.of(request.line, where.environment)

    def closed(self, folder: OutputFiles, request: ShellRequest, where: Where, cap: Cap) -> None:
        if cap.is_direct() or cap.is_whole():
            folder.remove()
            return
        if not self.record.is_kept(folder.folder.name, request.line, folder.size(), folder.has_cut()):
            self.record.delete_output(folder.folder.name, where)
