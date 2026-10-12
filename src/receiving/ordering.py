"""The order the handlers of one fact run in, resolved at boot from the names they gave.

A handler that must follow another names it; priority numbers do not exist, because two numbers that
are equal have no tie-break and the order falls to whichever feature loaded first. A name is a real
dependency, so the engine can check it: that it exists, that the names make no cycle, and that two
handlers nobody ordered do not write the same kind of row.
"""

from receiving import Registration


class OrdersAnUnknown(LookupError):
    @classmethod
    def of(cls, handler: str, named: str, fact: type, known: list[str]) -> "OrdersAnUnknown":
        return cls(f"{handler} runs after {named}, which handles no {fact.__name__}; the handlers of that fact are {', '.join(known) or 'none'}")


class OrdersInACircle(ValueError):
    @classmethod
    def of(cls, fact: type, left: list[str]) -> "OrdersInACircle":
        return cls(f"the handlers of {fact.__name__} wait on each other in a circle: {', '.join(sorted(left))}")


class WriteTheSameUnordered(ValueError):
    @classmethod
    def of(cls, fact: type, one: str, other: str, written: set[str]) -> "WriteTheSameUnordered":
        return cls(f"{one} and {other} both write {', '.join(sorted(written))} on {fact.__name__} with no order between them; "
                   f"name the one that goes first with after=")


def ordered(fact: type, handlers: list[Registration]) -> list[Registration]:
    """The handlers of one fact in the order they run. Raises here, at boot, rather than letting load order decide."""
    known = {one.name: one for one in handlers}
    for one in handlers:
        for named in one.after:
            if named not in known:
                raise OrdersAnUnknown.of(one.name, named, fact, list(known))
    run, waiting = [], list(handlers)
    while waiting:
        ready = [one for one in waiting if all(named in {done.name for done in run} for named in one.after)]
        if not ready:
            raise OrdersInACircle.of(fact, [one.name for one in waiting])
        run.extend(ready)
        waiting = [one for one in waiting if one not in ready]
    clashing(fact, run)
    return run


def clashing(fact: type, run: list[Registration]) -> None:
    """Two handlers nobody ordered must commute, so they may not write the same kind of row. Keyed by what is written, not by which service writes it, or every nudge handler on one fact would be refused for sharing the chat."""
    for i, one in enumerate(run):
        for other in run[i + 1:]:
            if one.name in other.after or other.name in one.after:
                continue
            if shared := one.writes & other.writes:
                raise WriteTheSameUnordered.of(fact, one.name, other.name, shared)
