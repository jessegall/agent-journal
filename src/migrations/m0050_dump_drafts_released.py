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
            for ref in dump.refs:
                type_, _, n = ref.partition(":")
                if type_ not in CONTROLLERS or not n.isdigit():
                    continue
                controller = CONTROLLERS[type_](record, actor=SYSTEM)
                try:
                    if controller.load(int(n)).data.get(DRAFT_OF) != dump.ref:
                        continue
                    controller.update(int(n), **{DRAFT_OF: ""})
                except (KeyError, ValueError, Refused):
                    continue
                released.append(ref)
    return released
