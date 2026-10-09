import json
from pathlib import Path

from controllers.types import Agents, environment_records
from resources.base import SYSTEM

KEPT = 50


def run(root: Path) -> list[str]:
    """Folds the agent rows that name the same session into the one that reported last: their dated lists, such as compactions and skill loads, are kept on it and the others are put away."""
    lines = []
    for record in environment_records(Path(root)):
        agents = Agents(record, actor=SYSTEM)
        sessions: dict[str, list] = {}
        for row in agents.rows.every():
            if not row.deleted and not row.data.get("parent"):
                sessions.setdefault(row.title, []).append(row)
        for session, rows in sessions.items():
            if len(rows) > 1:
                lines.append(folded(agents, record.env, session, rows))
    return lines


def folded(agents: Agents, env: str, session: str, rows: list) -> str:
    kept, *others = sorted(rows, key=lambda row: row.data.get("at") or 0, reverse=True)
    lists = [dated_lists(row) for row in rows]
    merged = {field: unique(sorted((entry for held in lists for entry in held.get(field, [])), key=lambda entry: entry["at"]))[-KEPT:]
              for field in {field for held in lists for field in held}}
    agents.update(kept.n, **merged)
    for other in others:
        agents.delete(other.n, f"folded into {kept.n}")
    return f"session {session} had {len(rows)} agent rows in {env}, so {', '.join(str(row.n) for row in others)} was folded into {kept.n}"


def dated_lists(row) -> dict[str, list]:
    return {field: value for field, value in row.data.items() if isinstance(value, list) and value and all(isinstance(entry, dict) and "at" in entry for entry in value)}


def unique(entries: list[dict]) -> list[dict]:
    seen, kept = set(), []
    for entry in entries:
        key = json.dumps(entry, sort_keys=True)
        if key not in seen:
            seen.add(key)
            kept.append(entry)
    return kept
