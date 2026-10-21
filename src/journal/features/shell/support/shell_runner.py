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
from journal.support.caller import Caller

EXIT = "__journal_exit"
TICK = 0.2
LIMIT_READ_INTERVAL = 10


class ShellRunner:
    """Runs one shell line for the shim and streams back what the agent sees: the line is split into its parts, run in the user's shell by the worker, each part shown as its status lands and the cap says, the chain moved to the background past the foreground limit with a line naming its output, and an ended output kept under its number or forgotten. A read or write of the project's code streams straight through, nothing kept. The stream is read after the request has left its scope, so the environment comes along and is named again for every read and write; the exit line starts on a line of its own."""

    def __init__(self, config: Config, caps: OutputCap, limits: ForegroundLimit, worker: ChainWorker, record: ShellRecord, scope: Scope) -> None:
        self.config, self.caps, self.limits, self.worker, self.record, self.scope = config, caps, limits, worker, record, scope

    def run(self, request: ShellRequest, caller: Caller, environment: int) -> Iterator[bytes]:
        with self.scope.environment(environment):
            cap = self.caps.build(request.line)
            folder = OutputFiles(self.config.home / "runtime" / "outputs" / f"{int(time.time())}-{threading.get_ident()}")
            folder.split(request.line, Chain.parts(request.line))
            if not cap.is_whole() and not cap.is_direct():
                folder.numbered(self.record.start(folder.folder.name, "\n".join(p.text for p in Chain.parts(request.line) if p.recorded), folder.folder, caller))
        output_text: queue.Queue = queue.Queue()
        ended: list[int] = []
        thread = threading.Thread(target=lambda: self.worked(folder, request, caller, cap.is_direct(), output_text, ended, environment), name="shell-chain", daemon=True)
        thread.start()
        last = b"\n"
        with self.scope.environment(environment):
            for block in (self.direct(output_text, thread) if cap.is_direct() else self.foreground(folder, request, caller, cap)):
                last = block[-1:] or last
                yield block
        if cap.is_direct() or folder.is_finished():
            self.closed(folder, request, caller, cap)
            yield f"{'' if last == b'\n' else chr(10)}{EXIT} {ended[0] if ended else 0}\n".encode()

    def worked(self, folder: OutputFiles, request: ShellRequest, caller: Caller, direct: bool, output_text: queue.Queue, ended: list[int], environment: int) -> None:
        with self.scope.environment(environment):
            ended.append(self.worker.run(folder, request, caller, direct, output_text.put))
        output_text.put(None)

    @staticmethod
    def direct(output_text: queue.Queue, thread: threading.Thread) -> Iterator[bytes]:
        while True:
            block = output_text.get()
            if block is None:
                thread.join()
                return
            yield block

    def foreground(self, folder: OutputFiles, request: ShellRequest, caller: Caller, cap: Cap) -> Iterator[bytes]:
        display = OutputShow(folder, cap)
        limit = self.limits.build(request.line, caller.environment)
        shown, tick, began = 0, 0, time.monotonic()
        while True:
            while folder.has_ended(shown):
                yield display.build(shown).encode()
                shown += 1
            if folder.is_finished():
                return
            if limit > 0 and time.monotonic() - began >= limit:
                folder.moved()
                number = self.record.moved(folder.folder.name, folder.part_text(shown), folder.folder, caller)
                from journal.features.shell.feature import Shell
                yield f"{Shell.BACKGROUND_MOVE.create(n=number, file=str(folder.folder)).rendered()}\n{EXIT} 0\n".encode()
                return
            time.sleep(TICK)
            tick += 1
            if tick % LIMIT_READ_INTERVAL == 0:
                limit = self.limits.build(request.line, caller.environment)

    def closed(self, folder: OutputFiles, request: ShellRequest, caller: Caller, cap: Cap) -> None:
        if cap.is_direct() or cap.is_whole():
            folder.remove()
            return
        if not self.record.is_stored(folder.folder.name, request.line, folder.size(), folder.has_cut()):
            self.record.delete_output(folder.folder.name, caller)
