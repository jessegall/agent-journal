from pathlib import Path

from controllers.base import CONTROLLERS
from controllers.notices import Notices
from engine.outbox import Outbox, Request
from engine.record import Record
from resources.base import SYSTEM, Refused


def held_here(root: Path, asked: Request) -> bool:
    return Record(root, asked.env).holds(CONTROLLERS[asked.type].resource.scope)


def run(root: Path, asked: Request) -> None:
    getattr(CONTROLLERS[asked.type](Record(root, asked.env), actor=asked.actor), asked.word)(*asked.args, **asked.named)


def request(root: Path, asked: Request) -> None:
    """Runs a write into another scope now when this machine holds that scope, and otherwise sends it to the machine that does."""
    if held_here(root, asked):
        run(root, asked)
        return
    Outbox(root).send(asked)


def deliver(root: Path) -> int:
    """Runs every waiting request whose scope this machine holds now; the rest wait, and a refused one becomes a notice where it was meant."""
    taken = Outbox(root).take(lambda asked: held_here(root, asked))
    for asked in taken:
        try:
            run(root, asked)
        except Refused as error:
            Notices(Record(root, asked.env), actor=SYSTEM).create("A change sent from another machine was refused", brief=f"{asked.type} {asked.word}: {error}", tone="warn")
    return len(taken)
