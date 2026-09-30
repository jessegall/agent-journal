import multiprocessing
import queue
from dataclasses import dataclass
from multiprocessing.connection import Connection
from pathlib import Path

WORKERS = "server.workers"
LIMIT = 20.0
IN_SERVER = frozenset({"environment", "feature", "plugin", "share", "phone", "connection"})
FORKED = multiprocessing.get_context("fork")


def serve(pipe: Connection, root: Path) -> None:
    from commands.cli import captured
    while True:
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
    def forked(cls, root: Path) -> "Worker":
        ours, theirs = FORKED.Pipe()
        process = FORKED.Process(target=serve, args=(theirs, root), daemon=True)
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
    def __init__(self, root: Path, count: int) -> None:
        self.root = root
        self.idle: queue.Queue = queue.Queue()
        for _ in range(count):
            self.idle.put(Worker.forked(root))

    def run(self, args: list[str]) -> tuple[str, int | None]:
        worker = self.idle.get()
        try:
            answer = worker.run(args)
        except (TimeoutError, EOFError, OSError):
            worker.stop()
            worker = Worker.forked(self.root)
            answer = f"! {' '.join(args)} ran past {int(LIMIT)} seconds in a worker and was stopped", 1
        self.idle.put(worker)
        return answer

    def stop(self) -> None:
        while not self.idle.empty():
            self.idle.get().stop()


POOL: list[Workers] = []


def start(root: Path, count: int) -> None:
    if count > 0:
        POOL.append(Workers(root, count))


def stop() -> None:
    for pool in POOL:
        pool.stop()
    POOL.clear()


def run(args: list[str], root: Path) -> tuple[str, int | None]:
    from commands.cli import captured, noun_of
    if POOL and noun_of(args) not in IN_SERVER:
        return POOL[0].run(args)
    return captured(args, root)
