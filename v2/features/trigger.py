import json
import time

PERCENT, USES, MINUTES, IDLE, START = "percent", "uses", "minutes", "idle", "start"
UNITS = (PERCENT, USES, MINUTES, IDLE, START)


def spec(record, name: str, default: dict) -> dict:
    return record.setting("triggers", {}).get(name, default)


def _file(record, session: str, name: str):
    return record.root / "runtime" / f"trigger-{session}-{name}.json"


def last(record, session: str, name: str) -> dict:
    try:
        return json.loads(_file(record, session, name).read_text())
    except (OSError, ValueError):
        return {}


def due(record, agent, name: str, default: dict) -> bool:
    s = spec(record, name, default)
    if not s:
        return False
    was = last(record, agent.title, name)
    now = agent.data
    observe(record, agent, name, was)
    unit, every = s.get("unit") or s.get("on"), float(s.get("every") or 1)
    if unit == PERCENT:
        return int(float(now.get("context") or 0) // every) > int(float(was.get("context") or 0) // every)
    if unit == USES:
        return int(now.get("uses") or 0) - int(was.get("uses") or 0) >= every
    if unit == MINUTES:
        return time.time() - float(was.get("at") or 0) >= every * 60
    if unit == IDLE:
        return now.get("status") == IDLE and was.get("status") != IDLE
    if unit == START:
        return now.get("event") == "SessionStart" and was.get("event") != "SessionStart"
    return False


def write(record, agent, name: str, **fields) -> None:
    f = _file(record, agent.title, name)
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps({**last(record, agent.title, name), **fields}))


def observe(record, agent, name: str, was: dict) -> None:
    if (was.get("status"), was.get("event")) != (agent.data.get("status"), agent.data.get("event")):
        write(record, agent, name, status=agent.data.get("status"), event=agent.data.get("event"))


def fired(record, agent, name: str) -> None:
    write(record, agent, name, at=time.time(), context=agent.data.get("context") or 0, uses=agent.data.get("uses") or 0)
