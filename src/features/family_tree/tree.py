from dataclasses import asdict, dataclass
from pathlib import Path

from controllers.types import Agents, Environments
from engine.record import Record
from engine.transcript import PEER, SENT
from providers import PROVIDERS
from resources.base import SYSTEM


@dataclass(frozen=True)
class Member:
    id: str
    label: str
    kind: str
    environment: str = ""
    status: str = ""
    detail: str = ""
    n: int = 0
    session: str = ""
    loops: int = 0


@dataclass(frozen=True)
class Place:
    title: str
    owner: str
    launched_from: str


@dataclass(frozen=True)
class Link:
    source: str
    target: str
    kind: str
    count: int = 1


def agent_id(env: str, session: str) -> str:
    return f"agent:{env}:{session}"


def peer_id(name: str) -> str:
    return f"peer:{name}"


def family(record) -> dict:
    rows = {env.title: env for env in Environments(record, actor=SYSTEM)._every() if not env.deleted}
    envs = [Place(title, rows[title].owner if title in rows else "", rows[title].launched_from if title in rows else "")
            for title in dict.fromkeys([record.env, *rows])]
    members, links = {}, []
    primary = {}
    for env in envs:
        agents = Agents(Record(record.root, env.title), actor=SYSTEM)
        for row in (row for row in agents._standing() if not row.parent):
            key = agent_id(env.title, row.title)
            members[key] = Member(key, f"{env.title} · {row.provider or 'agent'}", env.owner.split(":", 1)[0] if env.owner else "main",
                                  env.title, row.status, env.owner, row.n, loops=len(row.data.get("loops") or {}))
            named = {}
            for sub in row.data.get("subagent_rows") or []:
                child = f"sub:{row.title}:{sub.get('id', '')}"
                members[child] = Member(child, sub.get("task", "subagent"), "subagent", env.title, "running" if sub.get("running") else "done",
                                        sub.get("type", ""), row.n, sub.get("session", ""))
                links.append(Link(key, child, "dispatched"))
                if sub.get("task_id"):
                    named[sub["task_id"]] = child
            links.extend(messaged(row, key, members, named))
        found = agents.primary()
        if found:
            primary[env.title] = agent_id(env.title, found.title)
    for env in envs:
        parent, child = primary.get(env.launched_from), primary.get(env.title)
        if parent and child:
            links.append(Link(parent, child, "started"))
    return {"members": [asdict(member) for member in members.values()], "links": [asdict(link) for link in merged(links)]}


MESSAGED: dict[str, tuple[int, int, list[tuple[str, str, str]]]] = {}


def messaged(row, key: str, members: dict, named: dict) -> list[Link]:
    provider = PROVIDERS.get(row.provider)
    if not provider or not row.transcript:
        return []
    try:
        size = Path(row.transcript).stat().st_size
    except OSError:
        return []
    held = MESSAGED.get(row.transcript)
    if held and held[0] == size:
        pairs = held[2]
    else:
        turns = provider().transcript(row.transcript)
        read = held[1] if held and held[1] <= len(turns) else 0
        pairs = (held[2] if read else []) + exchanged(turns[read:])
        MESSAGED[row.transcript] = (size, len(turns), pairs)
    found = []
    for direction, name, label in pairs:
        other = named.get(name) or peer_id(name)
        if other not in members:
            members[other] = Member(other, label, "peer")
        found.append(Link(key, other, "messaged") if direction == SENT else Link(other, key, "messaged"))
    return found


def exchanged(turns) -> list[tuple[str, str, str]]:
    pairs = []
    for turn in turns:
        kind, _, rest = turn.who.partition(":")
        if kind == SENT and rest:
            pairs.append((SENT, rest, rest))
        elif kind == PEER and rest:
            name, _, sender = rest.partition(":")
            pairs.append((PEER, sender or name, name or sender))
    return pairs


def merged(links: list[Link]) -> list[Link]:
    counted: dict[tuple, int] = {}
    for link in links:
        counted[(link.source, link.target, link.kind)] = counted.get((link.source, link.target, link.kind), 0) + 1
    return [Link(source, target, kind, count) for (source, target, kind), count in counted.items()]
