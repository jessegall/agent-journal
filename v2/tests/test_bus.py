import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.engine import bus  # noqa: E402
from v2.resources.base import ACTIONS, Event  # noqa: E402
from v2.resources.types import TYPES  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


def event(type_, action, n=1):
    return Event(id=n, at=0.0, type=type_, n=n, action=action, actor="user")


heard = []
bus.clear()
off_all = bus.on(bus.ANY, lambda e: heard.append(("*", e.ref, e.action)))
bus.on("todo", lambda e: heard.append(("todo", e.ref, e.action)))
bus.on("deleted", lambda e: heard.append(("deleted", e.ref, e.action)))
bus.on("plan.created", lambda e: heard.append(("plan.created", e.ref, e.action)))

bus.emit(event("todo", "created"))
check("a listener on everything and one on the type hear a to-do created", heard, [("*", "todo:1", "created"), ("todo", "todo:1", "created")])
heard.clear()
bus.emit(event("plan", "deleted", 3))
check("the action listener and the exact type.action listener are distinct hooks", heard, [("*", "plan:3", "deleted"), ("deleted", "plan:3", "deleted")])
heard.clear()
bus.emit(event("plan", "created", 4))
check("type.action hears only that pair", heard, [("*", "plan:4", "created"), ("plan.created", "plan:4", "created")])
heard.clear()
off_all()
bus.emit(event("doc", "updated", 5))
check("a listener taken off hears nothing more", heard, [])

bus.clear()
for type_ in TYPES:                                   # every type and every action reaches a listener on the type
    heard.clear()
    off = bus.on(type_, lambda e: heard.append((e.ref, e.action)))
    for action in ACTIONS:
        bus.emit(event(type_, action))
    check(f"{type_}: every action reaches the listener on the type, in order", heard, [(f"{type_}:1", a) for a in ACTIONS])
    off()

bus.clear()
heard.clear()
bus.emit(event("todo", "created"))
check("cleared: nothing listens, nothing breaks", heard, [])

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
