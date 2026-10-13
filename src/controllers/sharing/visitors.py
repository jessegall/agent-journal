import time

from resources.base import Refused
from resources.sharing import INDEX, SHORTEST_SNIPPET

NAME_LIMIT = 40
TEXT_LIMIT = 2000
SNIPPET = 60
SENT_LIMIT = 10
SENT_WINDOW = 600
SENT: dict[str, list[float]] = {}


def visitor_name(given: str) -> str:
    name = " ".join("".join(ch for ch in str(given) if ch.isprintable() and ch != ":").split())
    if not name or len(name) > NAME_LIMIT:
        raise Refused(f"a name is 1 to {NAME_LIMIT} characters")
    return name


def visitor_text(given: str) -> str:
    text = str(given).strip()
    if not text or len(text) > TEXT_LIMIT:
        raise Refused(f"a comment is 1 to {TEXT_LIMIT} characters")
    return text


def count_sent(token: str) -> None:
    now = time.time()
    recent = [at for at in SENT.get(token, []) if now - at < SENT_WINDOW]
    if len(recent) >= SENT_LIMIT:
        raise Refused("too many comments on this link just now; try again in a few minutes")
    SENT[token] = [*recent, now]


def index_comment(record, comment, path) -> None:
    state = record.state("sharing")
    snippets = [line.strip()[:SNIPPET] for line in comment.brief.splitlines() if len(line.strip()) >= SHORTEST_SNIPPET]
    kept = [entry for entry in state.get(INDEX, []) if entry["n"] != comment.n]
    state.set(INDEX, [*kept, *({"n": comment.n, "snippet": snippet, "path": f"{path.parent.name}/{path.name}"} for snippet in (snippets or [""]))])


def unindex_comment(record, n: int) -> None:
    state = record.state("sharing")
    state.set(INDEX, [entry for entry in state.get(INDEX, []) if entry["n"] != int(n)])
