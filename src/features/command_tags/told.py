from engine import runtime

RAN = "tags-ran.txt"


def keep(record, session: str, line: str) -> None:
    """Keeps what a tag did until the agent's next tool call, which is where it is told. A whisper would go out over the session channel, and the user sees everything that arrives there."""
    path = runtime.session_file(record.root, session, RAN)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as kept:
        kept.write(f"{line}\n")


def told(call) -> str:
    """Hands the agent what its tags did, on the hook's own answer, and forgets it."""
    path = runtime.session_file(call.record.root, call.session, RAN)
    if not path.is_file():
        return ""
    lines = [line for line in path.read_text().splitlines() if line.strip()]
    path.unlink(missing_ok=True)
    return "".join(f"[journal] {line}\n" for line in lines)
