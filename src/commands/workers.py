import multiprocessing
import os
import queue
from dataclasses import dataclass
from multiprocessing.connection import Connection
from pathlib import Path

WORKERS = "server.workers"
LIMIT = 20.0
ALIVE_EVERY = 1.0
IN_SERVER = frozenset({"environment", "feature", "plugin", "share", "phone", "connection"})
FORKED = multiprocessing.get_context("fork")


def serve(pipe: Connection, root: Path, parent: int, inherited: tuple[int, ...]) -> None:
    from commands.cli import captured
    for fd in inherited:
        os.close(fd)
    while os.getppid() == parent:
        if not pipe.poll(ALIVE_EVERY):
            continue
        try:
            args = pipe.recv()
        except EOFError:
            return
        pipe.send(captured(args, root))


@dataclass(frozen=True)
class Worker:
    process: multiprocessing.Process
    pipe: Connection

    @classmethod
    def forked(cls, root: Path, inherited: tuple[int, ...]) -> "Worker":
        ours, theirs = FORKED.Pipe()
        process = FORKED.Process(target=serve, args=(theirs, root, os.getpid(), (*inherited, ours.fileno())), daemon=True)
        process.start()
        theirs.close()
        return cls(process, ours)

    def run(self, args: list[str]) -> tuple[str, int | None]:
        self.pipe.send(args)
        if not self.pipe.poll(LIMIT):
            raise TimeoutError(args)
        return self.pipe.recv()

    def stop(self) -> None:
        self.process.kill()
        self.pipe.close()


class Workers:
    def __init__(self, root: Path, count: int, listening: int) -> None:
        self.root, self.listening = root, listening
        self.pipes: set[int] = set()
        self.idle: queue.Queue = queue.Queue()
        for _ in range(count):
            self.idle.put(self.forked())

    def forked(self) -> Worker:
        worker = Worker.forked(self.root, (self.listening, *self.pipes))
        self.pipes.add(worker.pipe.fileno())
        return worker

    def run(self, args: list[str]) -> tuple[str, int | None]:
        worker = self.idle.get()
        try:
            answer = worker.run(args)
        except (TimeoutError, EOFError, OSError):
            self.pipes.discard(worker.pipe.fileno())
            worker.stop()
            worker = self.forked()
            answer = f"! {' '.join(args)} ran past {int(LIMIT)} seconds in a worker and was stopped", 1
        self.idle.put(worker)
        return answer

    def stop(self) -> None:
        while not self.idle.empty():
            self.idle.get().stop()


POOL: list[Workers] = []


def start(root: Path, count: int, listening: int) -> None:
    if count > 0:
        POOL.append(Workers(root, count, listening))


def stop() -> None:
    for pool in POOL:
        pool.stop()
    POOL.clear()


def run(args: list[str], root: Path) -> tuple[str, int | None]:
    from commands.cli import captured, noun_of
    if POOL and noun_of(args) not in IN_SERVER:
        return POOL[0].run(args)
    return captured(args, root)
