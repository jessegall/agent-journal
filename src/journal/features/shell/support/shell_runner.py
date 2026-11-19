import queue
import threading
import time
from dataclasses import replace
from typing import Iterator

from journal.support.timeout import Timeout
from journal.engine.nudger import Nudger
from journal.engine.nudge import Nudge
from journal.repositories.entries import Entries
from journal.support.command_classifier import CommandClassifier
from journal.support.command_lines import CommandLines
from journal.support.command_shape import CommandShape
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.reader_guess import ReaderGuess
from journal.features.shell.support.readers import Readers
from journal.config import Config
from journal.features.aliases.support.alias_lines import AliasLines
from journal.models.alias import Alias
from journal.repositories.command_outputs import CommandOutputs
from journal.features.shell.support.activity_label import LONG_RUNS, ActivityLabel
from journal.features.shell.support.git_commands import GitCommands
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
from journal.support.stage_times import StageTimes
from journal.features.faults.support.request_time_recorder import RequestTimeRecorder
from journal.features.shell.shell_nudges import ShellNudges
from journal.features.shell.support.sleep_loop import SleepLoop
from journal.features.shell.support.sleep_loop_wait import SleepLoopWait
from journal.hooks.support.hook_seats import HookSeats
from journal.engine.support.decision_returns import DecisionReturns
from journal.engine.states_catalogue import StatesCatalogue
from journal.models.command_output import CommandOutput
from journal.features.shell.support.output_process_card import OutputProcessCard
from journal.features.shell.support.restart_queue import RestartQueue
from journal.support.time_source import TimeSource
from journal.support.command_part import CommandPart

EXIT = "__journal_exit"
SHELL = "SHELL"
SETUP_ROUTE = "/shell/setup"
TICK_SECONDS = 0.2
LIMIT_READ_TICKS = 10
VARIED_RUNS = 3

# a restart waits on the commands running when it was asked, and one started now would be cut off by it
RESTART_HOLD = "the journal restarts once the commands running now end, and this one would be cut off by it: run it again once the journal is back, in a minute or two"

class ShellRunner:
    """Runs one shell line for the shim and streams back what the agent sees: the line is split into its parts, the journal's own setup of the line timed and reported like a slow request when it runs past its budget, run in the user's shell by the worker, each part shown as its status lands and the cap says, the chain moved to the background past the foreground limit with a line naming its output, and an ended output stored under its number or forgotten. A read or write of the project's code streams straight through, nothing stored. The stream is read after the request has left its scope, so the environment comes along and is named again for every read and write; the exit line starts on a line of its own. While a restart waits, a command that goes to the background at once would be cut off by it, so it is refused before it is recorded; a run known to take long moves to the background at once: a test run or a build, or a command whose last run went past the limit, and any other runs in the foreground until it passes the limit; a run whose card shows, or will, keeps its output for the card to open."""

    def __init__(self, config: Config, caps: OutputCap, limits: ForegroundLimit, worker: ChainWorker, record: ShellRecord, scope: Scope, guess: ReaderGuess, aliases: AliasLines, outputs: CommandOutputs, readers: Readers, entries: Entries, stages: StageTimes, recorder: RequestTimeRecorder, nudger: Nudger, card: OutputProcessCard, restarts: RestartQueue, time_source: TimeSource, classifier: CommandClassifier, lines: CommandLines, labels: ActivityLabel, shapes: CommandShape, git: GitCommands, loops: SleepLoopWait, seats: HookSeats, returns: DecisionReturns, states: StatesCatalogue) -> None:
        self.time_source, self.classifier, self.lines, self.labels, self.shapes, self.git = time_source, classifier, lines, labels, shapes, git
        self.loops, self.seats, self.returns, self.states = loops, seats, returns, states
        self.nudger = nudger
        self.config, self.caps, self.limits, self.worker, self.record, self.scope = config, caps, limits, worker, record, scope
        self.aliases, self.outputs, self.readers, self.entries = aliases, outputs, readers, entries
        self.stages, self.recorder, self.guess, self.card, self.restarts = stages, recorder, guess, card, restarts
        self.wrappers_told: set[str] = set()

    def run(self, posted: ShellRequest, unseated: Caller, environment: int) -> Iterator[bytes]:
        with self.scope.environment(environment):
            caller = self.seats.caller_seated(unseated)
        line = self.aliases.expanded(posted.line)
        if SleepLoop.matches(line):
            yield self.loop_waited(SleepLoop.parsed(line), caller, environment)
            return
        yield from self.chain_run(replace(posted, line=line), posted, caller, environment)

    def loop_waited(self, loop: SleepLoop, caller: Caller, environment: int) -> bytes:
        with self.scope.environment(environment):
            wait_text = self.loops.declared(loop, caller)
            notes = self.send_notes(caller, environment, [ShellNudges.SLEEP_LOOP_WAIT.create(title=loop.title, script=loop.script)])
        return f"{wait_text}{notes}{EXIT} 0\n".encode()

    def chain_run(self, request: ShellRequest, posted: ShellRequest, caller: Caller, environment: int) -> Iterator[bytes]:
        if self.is_held(request, caller, environment):
            yield f"{RESTART_HOLD}\n{EXIT} 1\n".encode()
            return
        began = time.perf_counter()
        with self.scope.environment(environment), self.stages.timed("shell setup"):
            cap = self.caps.build(request.line)
            folder = self.split_folder(request.line)
            if not cap.is_whole() and not cap.is_direct():
                self.recorded(folder, posted.line, caller, request.cwd)
        self.recorder.measured(SHELL, SETUP_ROUTE, (time.perf_counter() - began) * 1000)
        if not cap.is_direct():
            with self.scope.environment(environment):
                self.test_run_watched(folder, request.line, caller)
        output_text: queue.Queue = queue.Queue()
        ended: list[int] = []
        faults: list[Exception] = []
        thread = threading.Thread(target=lambda: self.worked(folder, request, caller, cap.is_direct(), output_text, ended, faults, environment), name="shell-chain", daemon=True)
        thread.start()
        last = b"\n"
        with self.scope.environment(environment):
            for block in (self.direct(output_text, thread, faults) if cap.is_direct() else self.foreground(folder, request, caller, cap, environment, faults)):
                last = block[-1:] or last
                yield block
        if cap.is_direct() or folder.is_finished():
            self.closed(folder, request, caller, cap)
        yield f"{'' if last == b'\n' else chr(10)}{EXIT} {ended[0] if ended else 0}\n".encode()

    def split_folder(self, line: str) -> OutputFiles:
        folder = OutputFiles(self.config.home / "runtime" / "outputs" / f"{time.time_ns()}-{threading.get_ident()}")
        folder.split(line, [self.lines.part_with_code_read(part) for part in Chain.parts(line)], self.classifier)
        return folder

    def recorded(self, folder: OutputFiles, line: str, caller: Caller, cwd: str) -> None:
        folder.numbered(self.record.start(folder.folder.name, "\n".join(Chain.self_parts(line)), folder.folder, caller, cwd))

    def test_run_watched(self, folder: OutputFiles, line: str, caller: Caller) -> None:
        if self.is_carded_test_run(folder, caller):
            reader = self.readers.reading(line)
            self.outputs.watch(self.outputs.find(folder.number()), reader.name if reader is not None else "", "", caller.actor)

    def worked(self, folder: OutputFiles, request: ShellRequest, caller: Caller, direct: bool, output_text: queue.Queue, ended: list[int], faults: list[Exception], environment: int) -> None:
        with self.scope.environment(environment):
            try:
                ended.append(self.worker.run(folder, request, caller, direct, output_text.put))
            except Exception as fault:
                faults.append(fault)
        output_text.put(None)

    @staticmethod
    def direct(output_text: queue.Queue, thread: threading.Thread, faults: list[Exception]) -> Iterator[bytes]:
        while True:
            block = output_text.get()
            if block is None:
                thread.join()
                raise_first(faults)
                return
            yield block

    def foreground(self, folder: OutputFiles, request: ShellRequest, caller: Caller, cap: Cap, environment: int, faults: list[Exception]) -> Iterator[bytes]:
        display = OutputShow(folder, cap)
        self.remove_plugin_alias_readers(request.line)
        limit = self.limits.build(request.line, caller.environment, caller.session)
        reader = self.readers.reading(request.line) if limit > 0 else None
        background = self.aliases.background_part(request.line)
        immediate = bool(background) or self.limits.is_background(request.line) or (reader is not None and self.is_long_run(self.readers.read_part(reader, request.line), limit))
        carded = self.is_carded_test_run(folder, caller)
        shown, tick, began = 0, 0, time.monotonic()
        while True:
            raise_first(faults)
            while folder.has_ended(shown):
                yield display.build(shown).encode()
                shown += 1
            if folder.is_finished():
                if carded and reader is None:
                    self.starting_reader_watch(folder, caller)
                yield self.send_notes(caller, environment, display.notes).encode()
                return
            if limit > 0 and (immediate or Timeout.seconds(limit).started(began).is_elapsed(time.monotonic())):
                yield self.background_move(folder, request.line, shown, caller, environment, display.notes).encode()
                return
            time.sleep(TICK_SECONDS)
            tick += 1
            if tick % LIMIT_READ_TICKS == 0:
                limit = self.limits.build(request.line, caller.environment, caller.session)

    def background_move(self, folder: OutputFiles, line: str, shown: int, caller: Caller, environment: int, notes: list[Nudge]) -> str:
        folder.moved()
        reader = self.readers.reading(line)
        part = self.readers.read_part(reader, line) if reader is not None else self.aliases.background_part(line) or folder.part_text(shown)
        number = self.record.moved(folder.folder.name, part, folder.folder, caller)
        watching = self.watch_lines(number, part, self.aliases.running(part), reader, caller)
        moved = [] if any(nudge.key == ShellNudges.WATCH_VIEW.key for nudge in watching) else [ShellNudges.BACKGROUND_MOVE.create(n=number, file=str(folder.folder))]
        return self.send_notes(caller, environment, [*notes, *moved, *watching])

    def is_carded_test_run(self, folder: OutputFiles, caller: Caller) -> bool:
        return caller.is_main_agent() and folder.number() > 0 and any(CommandPart.plain(text, self.classifier).classification.is_test_run for _, text in folder.recorded_texts())

    def starting_reader_watch(self, folder: OutputFiles, caller: Caller) -> None:
        output = self.outputs.find(folder.number())
        part = next(text for _, text in folder.recorded_texts() if CommandPart.plain(text, self.classifier).classification.is_test_run)
        guessed = self.guess.guessed(output, part)
        if guessed is not None:
            self.outputs.touch(output, caller.actor, watch_reader=guessed.name)

    def is_held(self, request: ShellRequest, caller: Caller, environment: int) -> bool:
        with self.scope.environment(environment):
            if not self.restarts.is_waiting(environment):
                return False
            reader = self.readers.reading(request.line)
            limit = self.limits.build(request.line, caller.environment, caller.session)
            return self.limits.is_background(request.line) or bool(self.aliases.background_part(request.line)) or (reader is not None and limit > 0 and self.is_long_run(self.readers.read_part(reader, request.line), limit))

    def is_long_run(self, part: str, limit: int) -> bool:
        last = self.outputs.last_run(part)
        return self.labels.build(part) in LONG_RUNS or (last is not None and last.run_seconds() >= limit)

    def send_notes(self, caller: Caller, environment: int, notes: list[Nudge]) -> str:
        if not caller.has_agent_row():
            return ""
        lines = [line for note in notes if (line := self.nudger.deliver(caller.agent_row, note))]
        return self.returns.chosen(self.states.stack(caller.agent_row).bottom()).note_lines(lines, environment)

    def remove_plugin_alias_readers(self, line: str) -> None:
        alias = self.aliases.line_alias(line)
        for reader in self.readers.alias_readers(alias) if alias is not None and alias.plugin else []:
            self.readers.removed(reader.name)

    def watch_lines(self, number: int, part: str, alias: Alias | None, reader: Reader | None, caller: Caller) -> list[Nudge]:
        if self.git.is_git_line(part):
            return []
        if alias is not None:
            return [*self.watched(number, alias, caller), *self.alias_wrapper_lines(alias)]
        wrapper = self.line_wrapper_lines(part)
        if reader is not None:
            return [*self.reader_watched(number, part, reader, caller), *wrapper]
        guessed = self.guess.guessed(self.outputs.find(number), part) if caller.is_main_agent() else None
        return [*self.reader_watched(number, part, guessed, caller), *wrapper] if guessed is not None else wrapper

    def alias_wrapper_lines(self, alias: Alias) -> list[Nudge]:
        unwrapped = self.classifier.time_unlimited(alias.line)
        if unwrapped == alias.line or alias.name in self.wrappers_told:
            return []
        self.wrappers_told.add(alias.name)
        return [ShellNudges.ALIAS_TIME_LIMIT.create(name=alias.name, line=unwrapped)]

    def line_wrapper_lines(self, part: str) -> list[Nudge]:
        unwrapped = self.classifier.time_unlimited(part)
        shape = self.shapes.build(unwrapped)
        if unwrapped == part or shape in self.wrappers_told:
            return []
        self.wrappers_told.add(shape)
        return [ShellNudges.LINE_TIME_LIMIT.create(command=shape)]

    def reader_watched(self, number: int, part: str, reader: Reader, caller: Caller) -> list[Nudge]:
        self.outputs.watch(self.outputs.find(number), reader.name, "", caller.actor)
        shape = self.shapes.build(part)
        watched = [ShellNudges.WATCH_VIEW.create(n=number, progress="running")]
        varied = self.entries.shape_commands(caller.session, shape) if caller.session and not reader.topic_pattern else set()
        return [*watched, ShellNudges.READER_TOPIC.create(command=shape, count=len(varied), reader=reader.name)] if len(varied) >= VARIED_RUNS else watched

    def watched(self, number: int, alias: Alias, caller: Caller) -> list[Nudge]:
        self.outputs.watch(self.outputs.find(number), alias.reader, "", caller.actor)
        return [ShellNudges.WATCH_VIEW.create(n=number, progress="running")]

    def is_carded(self, output: CommandOutput) -> bool:
        if not (output.watch_reader or output.is_watched):
            return False
        with self.scope.environment(output.environment_id):
            return output.has_run_long(self.time_source.seconds()) or self.card.is_shown(output)

    def closed(self, folder: OutputFiles, request: ShellRequest, caller: Caller, cap: Cap) -> None:
        if cap.is_direct() or cap.is_whole():
            folder.remove()
            return
        if not self.record.is_stored(folder.folder.name, request.line, folder.size(), folder.has_cut()) and not self.is_carded(self.outputs.chain_output(folder.folder.name)):
            self.record.delete_output(folder.folder.name, caller)


def raise_first(faults: list[Exception]) -> None:
    if faults:
        raise faults[0]
