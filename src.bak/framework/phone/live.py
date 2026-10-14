from pathlib import Path

from controllers.types import Phones
from engine import runtime
from engine.record import Record
from resources.base import SYSTEM


def phones_live(root: Path) -> bool:
    return bool(Phones(Record(root, runtime.env(root)), actor=SYSTEM)._live())


def phones_paired(record) -> bool:
    return bool(Phones(record, actor=SYSTEM).actives())
