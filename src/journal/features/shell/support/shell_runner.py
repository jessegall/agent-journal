import queue
import threading
import time
from dataclasses import replace
from typing import Iterator

from journal.supervisor_link import SupervisorLink
from journal.support.command_shape import CommandShape
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.readers import Readers
from journal.features.shell.support.script_reader import ScriptReader
from journal.config import Config
from journal.features.aliases.support.alias_lines import AliasLines
from journal.features.shell.support.output_views import OutputViews
from journal.features.shell.support.watch_suggestions import WatchSuggestions
from journal.models.alias import Alias
from journal.repositories.command_outputs import CommandOutputs
from journal.features.shell.support.cap import Cap
from journal.features.shell.support.chain_worker import ChainWorker
from journal.features.shell.support.foreground_limit import ForegroundLimit
from journal.features.shell.support.output_cap import OutputCap
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.output_show import OutputShow
from journal.features.shell.support.shell_record import ShellRecord
from journal.features.shell.support.shell_request import ShellRequest
from journal.support.chain import Chain
from journal.repositories.scope import Scope
from journal.support.caller import Caller

EXIT = "__journal_exit"
TICK_SECONDS = 0.2
LIMIT_READ_TICKS = 10


class ShellRunner:
    """Runs one shell line for the shim and streams back what the agent sees: the line is split into its parts, run in the user's shell by the worker, each part shown as its status lands and the cap says, the chain moved to the background past the foreground limit with a line naming its output, and an ended output kept under its number or forgotten. A read or write of the project's code streams straight through, nothing kept. The stream is read after the request has left its scope, so the environment comes along and is named again for every read and write; the exit line starts on a line of its own."""

    def __init__(self, config: Config, caps: OutputCap, limits: ForegroundLimit, worker: ChainWorker, record: ShellRecord, scope: Scope, suggestions: WatchSuggestions, aliases: AliasLines, outputs: CommandOutputs, views: OutputViews, readers: Readers, supervisor: SupervisorLink) -> None:
        self.config, self.caps, self.limits, self.worker, self.record, self.scope, self.suggestions = config, caps, limits, worker, record, scope, suggestions
        self.aliases, self.outputs, self.views, self.readers, self.supervisor = aliases, outputs, views, readers, supervisor

    def run(self, posted: ShellRequest, caller: Caller, environment: int) -> Iterator[bytes]:
        request = replace(posted, line=self.aliases.expanded(posted.line))
        with self.scope.environment(environment):
            cap = self.caps.build(request.line)
            folder = OutputFiles(self.config.home / "runtime" / "outputs" / f"{time.time_ns()}-{threading.get_ident()}")
            folder.split(request.line, Chain.parts(request.line))
            if not cap.is_whole() and not cap.is_direct():
                folder.numbered(self.record.start(folder.folder.name, "\n".join(Chain.self_parts(posted.line)), folder.folder, caller))
        output_text: queue.Queue = queue.Queue()
        ended: list[int] = []
        thread = threading.Thread(target=lambda: self.worked(folder, request, caller, cap.is_direct(), output_text, ended, environment), name="shell-chain", daemon=True)
        thread.start()
        last = b"\n"
        with self.scope.environment(environment):
            for block in (self.direct(output_text, thread) if cap.is_direct() else self.foreground(folder, request, caller, cap, environment)):
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

    def foreground(self, folder: OutputFiles, request: ShellRequest, caller: Caller, cap: Cap, environment: int) -> Iterator[bytes]:
        display = OutputShow(folder, cap)
        limit = self.limits.build(request.line, caller.environment, caller.session)
        reader = self.readers.reading(request.line) if limit > 0 else None
        shown, tick, began = 0, 0, time.monotonic()
        while True:
            while folder.has_ended(shown):
                yield display.build(shown).encode()
                shown += 1
            if folder.is_finished():
                self.send_notes(environment, display.notes)
                return
            if limit > 0 and (reader is not None or time.monotonic() - began >= limit):
                folder.moved()
                part = reader.commands.read_part(request.line) if reader is not None else folder.part_text(shown)
                number = self.record.moved(folder.folder.name, part, folder.folder, caller)
                alias = self.aliases.running(part)
                from journal.features.shell.feature import Shell
                self.send_notes(environment, [*display.notes, Shell.BACKGROUND_MOVE.create(n=number, file=str(folder.folder)).rendered(), *self.watch_lines(number, part, alias, reader, caller)])
                yield f"{EXIT} 0\n".encode()
                return
            time.sleep(TICK_SECONDS)
            tick += 1
            if tick % LIMIT_READ_TICKS == 0:
                limit = self.limits.build(request.line, caller.environment, caller.session)

    def send_notes(self, environment: int, notes: list[str]) -> None:
        for note in notes:
            self.supervisor.type(environment, note)

    def watch_lines(self, number: int, part: str, alias: Alias | None, reader: Reader | ScriptReader | None, caller: Caller) -> list[str]:
        if alias is not None:
            return self.watched(number, alias, caller)
        if reader is not None:
            return self.reader_watched(number, part, reader, caller)
        return self.suggestions.lines(number, part)

    def reader_watched(self, number: int, part: str, reader: Reader | ScriptReader, caller: Caller) -> list[str]:
        from journal.features.shell.feature import Shell
        self.views.card(self.outputs.watch(self.outputs.find(number), reader.name, "", caller.actor))
        return [Shell.READER_WATCH.create(n=number, command=CommandShape.build(part), reader=reader.name).rendered()]

    def watched(self, number: int, alias: Alias, caller: Caller) -> list[str]:
        from journal.features.shell.feature import Shell
        self.views.card(self.outputs.watch(self.outputs.find(number), alias.reader, "", caller.actor))
        return [Shell.ALIAS_WATCH.create(n=number, name=alias.name, reader=f" through the reader {alias.reader}" if alias.reader else "").rendered()]

    def closed(self, folder: OutputFiles, request: ShellRequest, caller: Caller, cap: Cap) -> None:
        if cap.is_direct() or cap.is_whole():
            folder.remove()
            return
        if not self.record.is_stored(folder.folder.name, request.line, folder.size(), folder.has_cut()):
            self.record.delete_output(folder.folder.name, caller)
