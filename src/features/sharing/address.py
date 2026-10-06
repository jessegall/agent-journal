from engine.extension import Extension
from engine.record import Record

RELIED_ON = Extension()


def relied_on(record: Record) -> bool:
    return any(depends(record.root) for depends in RELIED_ON.each(record))
