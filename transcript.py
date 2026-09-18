from __future__ import annotations

import contextlib
import json
import os
import pickle
import re
import tempfile
from pathlib import Path

import rollout

def _projects() -> Path:
    if os.environ.get("AGENT_JOURNAL_PROJECTS"):
        return Path(os.environ["AGENT_JOURNAL_PROJECTS"])
    if os.environ.get("AGENT_JOURNAL_IN_TESTS"):
        import tempfile
        return Path(tempfile.gettempdir()) / "agent-journal-test-projects"
    return Path.home() / ".claude" / "projects"


PROJECTS = _projects()


def project_dir(cwd: Path) -> Path:
    return PROJECTS / ("-" + str(cwd.resolve()).strip("/").replace("/", "-"))


def newest_session(cwd: Path) -> Path | None:
    d = project_dir(cwd)
    if not d.is_dir():
        return None
    files = [f for f in d.glob("*.jsonl") if f.is_file()]
    return max(files, key=lambda f: f.stat().st_mtime, default=None)


#: The environment variable every Bash call made from inside a session carries. Inside a
#: subagent it is the PARENT's id, measured — so a pin written from a subagent cites the
#: parent's transcript at the moment the agent was running, which is where the reader who
#: follows the citation will find the dispatch. That is stated here rather than hidden.
SESSION_ENV = "CLAUDE_CODE_SESSION_ID"


def last_reply(path: Path, limit: int = 400_000, settled: bool = True) -> tuple[str, str] | None:
    if not path.is_file():
        return None
    size = path.stat().st_size
    with path.open("rb") as fh:
        if size > limit:
            fh.seek(size - limit)
            fh.readline()  # a partial first line
        raw = fh.read().decode("utf-8", "replace")
    latest: tuple[str, str] | None = None
    if rollout.is_rollout(path):
        # THE SAME RULE ON CODEX'S RECORDS: the agent's last text since the user spoke, unless a tool call followed it
        for n, line in enumerate(raw.splitlines()):
            try:
                got = rollout.line_of(json.loads(line), n)
            except ValueError:
                continue
            if got is None:
                continue
            if got.kind == "human":
                if settled:
                    latest = None
            elif got.kind == "text" and got.tools and settled:
                latest = None
            elif got.kind == "text" and got.text.strip():
                latest = (got.text, got.ts)
        return latest
    for line in raw.splitlines():
        try:
            rec = json.loads(line)
        except ValueError:
            continue
        typ = rec.get("type")
        if typ == "user" and (rec.get("origin") or {}).get("kind") == "human":
            if settled:
                latest = None
            continue
        if typ != "assistant":
            continue
        text, tools, _, _ = _text_of(rec.get("message") or {})
        # TEXT A TOOL CALL FOLLOWS IS NOT THE REPLY. At a stop the final message may not be
        # written yet, and the line before the last tool call was being judged in its place.
        if settled and tools and not any(t in ASKS for t in tools):
            latest = None
        elif text.strip():
            latest = (text, str(rec.get("uuid") or rec.get("timestamp") or ""))
    return latest


def sessions(cwd: Path) -> list[Path]:
    d = project_dir(cwd)
    if not d.is_dir():
        return []
    return sorted((f for f in d.glob("*.jsonl") if f.is_file()),
                  key=lambda f: f.stat().st_mtime, reverse=True)


# the session-start block's wording, then and now: a mark nobody matches files the whole session under `default`
_START_MARK = re.compile(r"(?:you are on|this session is bound to) environment `([^`]+)`")
_SWITCH_MARK = re.compile(r"^\s*on (.+?) — ", re.M)
_BEFORE_TRACKS = "default"


def track_segments(lines: list[Line]) -> list[tuple[str, int, int]]:
    out: list[tuple[str, int, int]] = []
    here = _BEFORE_TRACKS
    lo = 1
    for l in lines:
        found = None
        if l.kind == "injected":
            m = _START_MARK.search(l.text or "")
            found = m.group(1) if m else None
        elif l.kind == "tool_result":
            m = _SWITCH_MARK.search(l.text or "")
            found = m.group(1) if m else None
        if found and found != here:
            if l.n > lo:
                out.append((here, lo, l.n - 1))
            here, lo = found, l.n
    last = lines[-1].n if lines else 0
    if last >= lo:
        out.append((here, lo, last))
    return out


def snippet(body: str, term: str, before: int = 140, after: int = 200) -> str:
    body = " ".join(body.split())
    needle = term.lower()
    at = body.lower().find(needle)
    a, b = max(0, at - before), min(len(body), at + len(term) + after)
    piece = body[a:b]
    j = piece.lower().find(needle)
    if j >= 0:
        piece = piece[:j] + "«" + piece[j:j + len(term)] + "»" + piece[j + len(term):]
    return ("…" if a else "") + piece + ("…" if b < len(body) else "")


def segments(lines: list[Line], marks: list | None = None) -> list[tuple[str, int, int]]:
    last = lines[-1].n if lines else 0
    recorded = sorted((int(n), str(env)) for env, n in (marks or []) if n)
    if not recorded:
        return track_segments(lines)
    out = track_segments([l for l in lines if l.n < recorded[0][0]])
    for i, (n, env) in enumerate(recorded):
        hi = recorded[i + 1][0] - 1 if i + 1 < len(recorded) else last
        if hi >= n:
            out.append((env, n, hi))
    return out


def on_track(lines: list[Line], track: str, marks: list | None = None) -> list[Line]:
    keep = [(lo, hi) for t, lo, hi in segments(lines, marks) if t == track]
    return [l for l in lines if any(lo <= l.n <= hi for lo, hi in keep)]


#: What a session id looks like: a UUID. Only one of those is looked for across projects —
#: a subagent's `agent-xxxx` or a fixture's `s1` would find a stale namesake elsewhere.
_SESSION_ID = re.compile(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")


#: (cwd, stem) -> the path. WHERE A TRANSCRIPT IS DOES NOT CHANGE INSIDE ONE COMMAND, and
#: this was answered three times per invocation — 0.82 of a 2.24-second `journal` in a real
#: project, because the last resort is a glob across EVERY project's folder for a session
#: that moved into a worktree. Correct, and not worth paying three times for one answer.
_FOUND: dict = {}


def find(cwd: Path, stem: str) -> Path | None:
    key = (str(cwd), stem)
    if key in _FOUND:
        return _FOUND[key]
    got = _find(cwd, stem)
    # ONLY A HIT IS REMEMBERED. A miss is the interesting case: a transcript that does not
    # exist yet is written moments later by the harness, and a process that cached "no" would
    # go on refusing to file marks for the rest of its life.
    if got is not None:
        _FOUND[key] = got
    return got


def _find(cwd: Path, stem: str) -> Path | None:
    if stem.startswith("rollout-"):                   # a Codex session keeps its file under ~/.codex/sessions
        return rollout.find(stem)
    d = project_dir(cwd)
    top = d / f"{stem}.jsonl"
    if top.is_file():
        return top
    for f in d.glob(f"*/subagents/{stem}.jsonl"):
        if f.is_file():
            return f
    # NOT UNDER THIS PROJECT'S FOLDER: a session that moved into a worktree keeps its
    # transcript under the folder of the checkout it started in, and a session id is
    # unique across every project, so it is looked for everywhere before it is given up.
    # Measured: `journal nothing` in a worktree found no transcript, wrote no mark, and
    # the hook — which reads its path from the payload — went on denying every call.
    # only this repository's other checkouts are searched; scanning every project folder cost seconds per lookup
    if _SESSION_ID.fullmatch(stem):
        for other in _checkouts(cwd):
            od = project_dir(other)
            if od == d:
                continue
            got = od / f"{stem}.jsonl"
            if got.is_file():
                return got
            for f in od.glob(f"*/subagents/{stem}.jsonl"):
                if f.is_file():
                    return f
    return None


_CHECKOUTS: dict = {}


def _checkouts(cwd: Path) -> list[Path]:
    key = str(cwd)
    if key not in _CHECKOUTS:
        import worktree
        found = [Path(cwd).resolve()]
        main = worktree.main_root(Path(cwd))
        if main is not None:
            found.append(Path(main).resolve())
        listing = worktree._git(Path(cwd), "worktree", "list", "--porcelain") or ""
        for line in listing.splitlines():
            if line.startswith("worktree "):
                path = Path(line[len("worktree "):]).resolve()
                if path not in found:
                    found.append(path)
        _CHECKOUTS[key] = found
    return _CHECKOUTS[key]


def session_transcript(cwd: Path) -> tuple[Path, bool] | None:
    sid = os.environ.get(SESSION_ENV, "")
    if sid:
        got = find(cwd, sid)
        if got is not None:
            return got, False
    got = newest_session(cwd)
    return (got, True) if got is not None else None


class Line:

    __slots__ = ("n", "role", "kind", "text", "ts", "tags", "tools", "parent")

    def __init__(self, n: int, role: str, kind: str, text: str, ts: str,
                 tags: list | None = None, tools: list | None = None, parent: str = ""):
        self.n = n
        self.role = role      # user | assistant | system
        self.kind = kind      # human | tool_result | injected | peer | task | text | superseded
        self.text = text
        self.ts = ts
        self.tags = tags if tags is not None else []
        self.tools = tools if tools is not None else []
        self.parent = parent  # the record this one answers; two prompts sharing it are one

    @property
    def spoken(self) -> bool:
        return self.kind in ("human", "text")


#: Tools whose call IS a message to the user, and whose result IS the user's reply. A
#: question asked through one of these lives in the tool_use input, and the answer comes
#: back as a tool_result — neither is a text block, so a reader of text blocks alone shows
#: the user answering a question that was never asked. Measured: "can you ask again",
#: then the question, then "I believe I answered with what I want", with nothing between.
ASKS = frozenset({"AskUserQuestion"})


def _asked(inp: dict) -> str:
    out = []
    for q in (inp or {}).get("questions") or []:
        if not isinstance(q, dict):
            continue
        line = str(q.get("question", "")).strip()
        opts = [str(o.get("label", "")) for o in q.get("options") or [] if isinstance(o, dict)]
        if opts:
            line += "  [" + " / ".join(o for o in opts if o) + "]"
        out.append(line)
    return "\n".join(f"asked: {q}" for q in out if q)


def _text_of(msg: dict) -> tuple[str, list[str], dict, list[str]]:
    content = msg.get("content")
    if isinstance(content, str):
        return content, [], {}, []
    out, tools, asks, answered = [], [], {}, []
    for block in content or []:
        t = block.get("type")
        if t == "text":
            out.append(block.get("text", ""))
        elif t == "tool_use":
            name = block.get("name", "?")
            tools.append(name)
            if name == "Skill":  # which skill: `Skill:loop` is how a running loop is recognised
                tools.append("Skill:" + str((block.get("input") or {}).get("skill", "")))
            if name in ASKS:
                asks[block.get("id", "")] = name
                out.append(_asked(block.get("input") or {}))
        elif t == "tool_result":
            answered.append(block.get("tool_use_id", ""))
            c = block.get("content")
            if isinstance(c, str):
                out.append(c)
            elif isinstance(c, list):
                out.extend(x.get("text", "") for x in c if isinstance(x, dict))
    return "\n".join(x for x in out if x), tools, asks, answered


#: Hook events that happen where the assistant STOPPED. This is the whole point of reading
#: hook records at all: a turn ends at a stop, and a stop is either the user speaking or a
#: hook interrupting. PostToolUse and PreToolUse are deliberately absent — they fire in the
#: MIDDLE of a turn, and counting one as a boundary would cut a turn in half and promote a
#: connective opener into the message. That is not hypothetical: the project this was first
#: read in has a PostToolUse hook that injects on 23 tool calls.
STOP_EVENTS = frozenset({"Stop", "SubagentStop", "SessionStart"})


def _hook_line(rec: dict) -> tuple[str, str] | None:
    a = rec.get("attachment") or {}
    kind, event = a.get("type"), a.get("hookEvent")
    if event not in STOP_EVENTS:
        return None
    if kind == "hook_additional_context":
        c = a.get("content")
        return ("\n".join(x for x in c if isinstance(x, str)) if isinstance(c, list)
                else str(c or "")), rec.get("timestamp", "")
    if kind == "hook_success" and event in ("Stop", "SubagentStop"):
        return str(a.get("stdout") or ""), rec.get("timestamp", "")
    return None


#: WHAT THE HARNESS LEAVES BEHIND when a hook's output was too big to inline. Both must be
#: present: `<persisted-output>` is the harness's own wrapper and appears in nothing this
#: package writes, and requiring the second string as well means ordinary prose that happens
#: to mention a large output cannot raise a false alarm.
PERSISTED = ("<persisted-output>", "Output too large")


def start_context(path: Path) -> tuple[str, bool] | None:
    if not path or not path.is_file():
        return None
    got = None
    with path.open() as fh:
        for line in fh:
            if "hook_additional_context" not in line:
                continue
            try:
                rec = json.loads(line)
            except ValueError:
                continue
            a = rec.get("attachment") or {}
            if a.get("type") != "hook_additional_context" or a.get("hookEvent") != "SessionStart":
                continue
            c = a.get("content")
            text = ("\n".join(x for x in c if isinstance(x, str)) if isinstance(c, list)
                    else str(c or ""))
            got = (text, all(m in text for m in PERSISTED))
    return got


def _kind(rec: dict, has_tool_result: bool) -> str:
    if rec.get("type") == "assistant":
        return "text"
    origin = (rec.get("origin") or {}).get("kind")
    if origin == "human":
        return "human"
    if origin == "peer":
        return "peer"
    if origin == "task-notification":
        return "task"
    if has_tool_result:
        return "tool_result"
    return "injected"


def last_model(path: Path | None, limit: int = 300_000) -> str:
    if path is None or not path.is_file():
        return ""
    if rollout.is_rollout(path):
        return rollout.last_model(path, limit)
    size = path.stat().st_size
    with path.open("rb") as fh:
        if size > limit:
            fh.seek(size - limit)
            fh.readline()
        raw = fh.read().decode("utf-8", "replace")
    model = ""
    for line in raw.splitlines():
        if '"model"' not in line:
            continue
        try:
            rec = json.loads(line)
        except ValueError:
            continue
        if rec.get("type") == "assistant":
            model = (rec.get("message") or {}).get("model") or model
    return model


def page(lines: list[Line], *, before: int | None = None, limit: int = 1000) -> dict:
    # a record with neither text nor a tool says nothing a reader can use; line numbers stay as they are
    lines = [x for x in lines if (x.text or "").strip() or x.tools]
    end = len(lines) if before is None else next((i for i, x in enumerate(lines) if x.n >= before), len(lines))
    start = max(0, end - limit)
    rows = lines[start:end]
    cap = 20000
    return {"total": len(lines), "prev": rows[0].n if rows and start > 0 else None,
            "lines": [{"n": x.n, "kind": x.kind, "role": x.role, "ts": x.ts, "tools": list(x.tools),
                       "text": (x.text or "")[:cap], "clipped": len(x.text or "") > cap} for x in rows]}


#: bumped whenever what `read` builds changes, so a cache written by an older version is parsed afresh
CACHE_VERSION = 1


def read(path: Path, cache: Path | None = None) -> tuple[list[Line], list[int]]:
    if not path.is_file():
        return [], []  # a transcript not yet written has no lines, not an error
    st = path.stat()
    lines: list[Line] = []
    boundaries: list[int] = []
    asked: set[str] = set()  # tool_use ids of questions put to the user, awaiting answers
    start = 0
    got = _cached(cache, path, st) if cache is not None else None
    if got:
        lines, boundaries, asked, start = got
    if start >= st.st_size:
        return lines, boundaries
    with path.open("rb") as fh:
        fh.seek(start)
        data = fh.read(st.st_size - start)
    # a cached read stops at the last complete line: the one still being written is parsed next time
    end = data.rfind(b"\n") + 1 if cache is not None else len(data)
    for raw in data[:end].splitlines():
        _take(raw, lines, boundaries, asked)
    if cache is not None and end:
        _keep(cache, path, st, lines, boundaries, asked, start + end)
    # THE LAST RECORD MAY HAVE NO NEWLINE YET, and it is often the turn's final message, the one the
    # stop hook judges. It is read now when it parses, and parsed again next time from the kept position.
    if cache is not None and end < len(data):
        _take(data[end:], lines, boundaries, asked)
    return lines, boundaries


def _take(raw: bytes, lines: list[Line], boundaries: list[int], asked: set[str]) -> None:
    raw = raw.strip()
    if not raw:
        return
    try:
        rec = json.loads(raw)
    except ValueError:
        return  # a half-written line is not a reason to lose the rest
    typ = rec.get("type")
    if typ in rollout.TYPES:                          # a Codex rollout: its records, read as lines
        line = rollout.line_of(rec, len(lines) + 1)
        if line is not None:
            lines.append(line)
        return
    if typ == "system" and rec.get("subtype") == "compact_boundary":
        boundaries.append(len(lines))
        return
    if typ == "attachment":
        got = _hook_line(rec)
        if got is None:
            return
        lines.append(Line(n=len(lines) + 1, role="user", kind="injected", text=got[0], ts=got[1]))
        return
    if typ not in ("user", "assistant"):
        return
    msg = rec.get("message") or {}
    text, tools, asks, answered = _text_of(msg)
    asked |= set(asks)
    content = msg.get("content")
    has_result = isinstance(content, list) and any(
        b.get("type") == "tool_result" for b in content
    )
    kind = _kind(rec, has_result)
    # THE ANSWER TO A QUESTION IS THE USER'S OWN WORDS, however the harness filed
    # it. It arrives as a tool_result, and a tool_result is the one kind the reader
    # treats as nobody's speech — so `journal user` lost every choice the user
    # made through the question tool. Filed as human, because it is.
    if kind == "tool_result" and any(a in asked for a in answered):
        kind = "human"
    line = Line(
        n=len(lines) + 1,
        role=msg.get("role", typ),
        kind=kind,
        text=text,
        ts=rec.get("timestamp", ""),
        tools=tools,
        parent=str(rec.get("parentUuid") or ""),
    )
    # THE SAME PROMPT, RECORDED TWICE. A message sent mid-turn is filed when it is
    # queued and again when it becomes the prompt, and one edited before the agent
    # answered is filed in each version — every copy answering the SAME parent
    # record. Measured: "dont start building it yet yhough", "…though", "…though.
    # First come back with a design", three lines for one thought. The last copy
    # is the one the agent answered, so the earlier ones are marked superseded and
    # stay in place: numbering is a citation, and dropping a record would shift
    # every line after it.
    if line.kind == "human" and line.parent:
        for prev in reversed(lines):
            if prev.kind == "text" and (prev.text or "").strip():
                break  # the agent answered in between: a genuinely new prompt
            if prev.kind == "human" and prev.parent == line.parent:
                prev.kind = "superseded"
                break
    lines.append(line)


def _cached(cache: Path, path: Path, st) -> tuple[list[Line], list[int], set[str], int] | None:
    try:
        with cache.open("rb") as fh:
            got = pickle.load(fh)
    except (OSError, EOFError, AttributeError, TypeError, ValueError, pickle.PickleError):
        return None
    if (not isinstance(got, dict) or got.get("version") != CACHE_VERSION or got.get("path") != str(path)
            or got.get("inode") != st.st_ino or not 0 <= got.get("offset", -1) <= st.st_size):
        return None
    return got["lines"], got["boundaries"], got["asked"], got["offset"]


def _keep(cache: Path, path: Path, st, lines: list[Line], boundaries: list[int], asked: set[str], offset: int) -> None:
    data = {"version": CACHE_VERSION, "path": str(path), "inode": st.st_ino, "offset": offset,
            "lines": lines, "boundaries": boundaries, "asked": asked}
    tmp = None
    try:
        cache.parent.mkdir(parents=True, exist_ok=True)
        fd, tmp = tempfile.mkstemp(dir=cache.parent, prefix=f".{cache.name}.", suffix=".tmp")
        with os.fdopen(fd, "wb") as fh:
            pickle.dump(data, fh, protocol=pickle.HIGHEST_PROTOCOL)
        os.replace(tmp, cache)
    except OSError:
        if tmp:
            with contextlib.suppress(OSError):
                os.unlink(tmp)


def since(lines: list[Line], boundaries: list[int], back: int = 0) -> list[Line]:
    if not boundaries:
        return lines
    marks = [0] + boundaries + [len(lines)]
    i = len(marks) - 2 - back
    if i < 0:
        i = 0
    lo, hi = marks[i], marks[i + 1]
    return [l for l in lines if lo < l.n <= hi]


#: How the harness records the user pressing stop: a user-role record whose text is this
#: marker, as an injected line when a message was interrupted and as a tool result when a
#: tool call was. A STORAGE FORMAT, like a tag's spelling — it is what the transcript says.
INTERRUPTED = "[Request interrupted by user"


def interrupted(line: Line) -> bool:
    return line.role == "user" and (line.text or "").lstrip().startswith(INTERRUPTED)


def filing_units(lines: list[Line]) -> set[int]:
    units: set[int] = set()
    current: int | None = None
    for l in lines:
        # AN INTERRUPTED TURN HAS NO MESSAGE. The user pressed stop mid-thought, so the
        # last text before the marker is a connective line that never got its ending —
        # "Probing the suspected bug directly:" — and holding for it accuses the agent of
        # an omission it was not allowed to finish. Measured twice in one day, in two
        # projects, each time on a line that opened a tool call. The turn is dropped, not
        # filed: nothing in it was delivered as an answer.
        if interrupted(l):
            current = None
            continue
        # A TURN ENDS WHEREVER THE ASSISTANT STOPPED, and it did not always stop because
        # the user spoke. A hook hold arrives as `injected`, and so does the SessionStart
        # block after a compaction — both land at a stop, which means the message before
        # them was DELIVERED and read. Boundarying only on `human` merged a held turn into
        # the next one and quietly demoted its final message to scaffolding. Caught by this
        # rule clearing a line it was written to catch.
        # A TASK NOTIFICATION IS A STOP TOO, and so is a peer's message: they are delivered
        # only when the assistant has finished. Measured: the direct answer to the user's
        # question, then a background agent's notification, then one more line — and the
        # answer was demoted to scaffolding and dropped from the digest as a routine reply.
        # Every user-role record that is not a tool result ends a turn.
        if l.role == "user" and l.kind != "tool_result":
            if current is not None:
                units.add(current)
            current = None
        # TEXT FOLLOWED BY A TOOL CALL IS NOT THE TURN'S MESSAGE, whatever comes after. At a stop
        # the hook can read the transcript before the harness has written the final message, and
        # then the line before the last tool call looked like the last word. Measured: every such
        # turn held as untagged once the stop hook's read became fast. A question to the user
        # speaks through its tool and stays a message.
        elif l.role == "assistant" and l.tools and not any(t in ASKS for t in l.tools):
            current = None
        elif l.kind == "text" and (l.text or "").strip():
            current = l.n
    if current is not None:
        units.add(current)
    return units
