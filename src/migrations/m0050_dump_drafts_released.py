from pathlib import Path

from controllers.base import CONTROLLERS
from controllers.stored import DRAFT_OF
from engine.record import Record
from resources.base import SYSTEM, Refused


def run(root: Path) -> list[str]:
    released = []
    for home in sorted((Path(root) / "environments").glob("*/")):
        record = Record(root, home.name)
        for dump in CONTROLLERS["dump"](record, actor=SYSTEM).all(completed=True, last=0):
            released += [ref for ref in dump.refs if freed(record, dump, ref)]
    return released


def freed(record, dump, ref: str) -> bool:
    type_, _, n = ref.partition(":")
    if type_ not in CONTROLLERS or not n.isdigit():
        return False
    controller = CONTROLLERS[type_](record, actor=SYSTEM)
    try:
        if controller.load(n).data.get(DRAFT_OF) != dump.ref:
            return False
        controller.update(int(n), **{DRAFT_OF: ""})
    except (KeyError, ValueError, Refused):
        return False
    return True
