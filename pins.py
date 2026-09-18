from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import entries
import fmt
import state
from templates import render as fill

#: `docs` IS IMPORTED WHERE IT IS USED, in the two places that render a pin's doc citation.
#: At module scope it made `import pins` an `import docs` as well — and `journal.py` imports
#: pins on every invocation, so deferring docs THERE bought nothing while this line stood.
#: A lazy import is only as lazy as the eagerest thing on the path to it.

KEY = "pins"

MESSAGES = {
    "fact_struck": "struck: {why}",
    "fact_line": "line {line}",
    "fact_no_line": "before lines were kept",
    "fact_replaces": "replaces {n}",
    "fact_promoted": "promoted from pin {n}",
    "fact_body": "has its reasoning ({key} show {n})",
    "fact_doc": "→ {label}",
    "just_now": "just now",
    "minute": "1m ago",
    "minutes": "{n}m ago",
    "hours": "{n}h ago",
    "days": "{n}d ago",
    "needs_fact": "pin what? one line: the fact, and what makes it matter",
    "no_such": "there is no {noun} {n}. `journal {key}` numbers them.",
    "no_such_all": "there is no {noun} {n}. `journal {key} --all` numbers them.",
    "already_struck": "{noun} {n} is already struck by: {why}",
    "replacing": "{noun} {n}, replacing {old}",
    "added": "{verb} {n} ({standing} standing)",
    "added_body": "\n  {msg}",
    "added_hint": "\n  the reasoning behind it: journal {key} replace {n} --brief",
    "needs_body": "a long form needs a body — pass it on stdin with --brief",
    "body_written": "{noun} {n} has its reasoning: {path}",
    "needs_section": 'a section needs a title: journal {key} amend {n} "<section title>" --brief',
    "has_section": "that long form already has a section called {title}",
    "section": "## {title}\n\n{text}",
    "section_added": "\n  added the section {title}",
    "volatile": "this pin cites {hit}, a path that exists for one session only — it will point at nothing "
                "tomorrow, which fails the test a pin has to pass. Put the file in the repo and cite that, or "
                "pin its CLAIMS instead of its location.",
    "too_long": "{length} characters, and a pin has {limit}. This is re-read in full at every compaction, so it "
                "has to be a CLAIM, not the reasoning behind it:\n  keep  …{keep}\n  cut   …{cut}\n"
                "The reasoning is not cut, it is MOVED: `--brief` on the same command takes it on stdin, and "
                "only the claim is printed into context. `journal pins show <n>` reads it back. Several claims "
                "are still several pins.",
    "promoted_to": "promoted to rule {n}",
    "promoted": "rule {n}, from pin {pin}: {fact}",
    "no_rules": "  No rules stand.",
    "no_pins": "  Nothing is pinned.",
    "before_lines": "{noun} {n} was written before pins recorded where they were said, so there is nothing to "
                    "read around. The fact still stands:\n  {fact}",
    "transcript_gone": "that pin names a transcript this machine no longer has.",
    "note_gone": "  ! the session it was written in ({want}) is gone; reading the newest instead\n",
    "note_delegated": "  ! written while the environment was DELEGATED: the writer may have been a subagent,\n"
                      "    whose words are one level under this transcript, in its subagents/ folder\n",
    "note_guessed": "  ! the transcript was GUESSED when this pin was written (no session id in the\n"
                    "    environment); the citation may point at another terminal's conversation\n",
    "around_line": "{edge}{n}  {mark}  {text}",
    "around_title": "{noun} {n}",
    "around_sub": "written at line {line}",
    "around": "{title}\n{note}\n  {fact}\n\n{body}\n\n  >> marks the line it was pinned at. "
              "journal conversation --back=N reads further.",
    "around_empty": "  (nothing was said around that line)",
    "head_rules": "RULES OF THIS PROJECT, on every environment. Decided, and still in force:",
    "head_compact": "FACTS THE SUMMARY YOU ARE HOLDING DID NOT KEEP. They were true before the compaction and "
                    "are true now:",
    "head_start": "FACTS THAT STAND ON THIS ENVIRONMENT, decided in earlier sessions and still true:",
    "carry_row": "  - {fact}[  \\[{age}\\]][  ·{noun} show {body}][  → {doc}]",
    "carry": "{head}\n{rows:\n}{more}",
    "doc_ref": "doc {doc}",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def _store(key: str = KEY, root: Path | None = None):
    import entries
    noun = "rule" if key == RULES else "pin"

    def facts(p: dict, n: int) -> list[str]:
        out = []
        if p.get("struck"):
            out.append(say("fact_struck", why=p["struck"]))
        if age(p.get("at", "")):
            out.append(age(p.get("at", "")))
        out.append(say("fact_line", line=p["line"]) if p.get("line") else say("fact_no_line"))
        if p.get("replaced"):
            out.append(say("fact_replaces", n=p["replaced"]))
        if p.get("promoted_from"):
            out.append(say("fact_promoted", n=p["promoted_from"]))
        if p.get("body"):
            out.append(say("fact_body", key=key, n=n))
        if p.get("doc") and root is not None:
            out.append(say("fact_doc", label=_doc_label(root, p["doc"])))
        return out

    return entries.Store(key=key, noun=noun, text="fact", retired="struck",
                         verb="struck", facts=facts)
#: A RULE IS A PIN FOR EVERY ENVIRONMENT. Pins say what this line of work decided; a rule says
#: what the project decided, and `tracks.switch` never moves it. Same shape, same cap,
#: same citation into the transcript — one more question before writing one: would it
#: be wrong on any OTHER environment? If only on this one, it is a pin.
RULES = "rules"


def _doc_label(root: Path, ref) -> str:
    import docs as docs_mod
    return docs_mod.ref_label(root, str(ref))


def age(at: str, now: datetime | None = None) -> str:
    try:
        when = datetime.fromisoformat((at or "").replace("Z", "+00:00"))
    except ValueError:
        return ""
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    secs = ((now or datetime.now(timezone.utc)) - when).total_seconds()
    if secs < 60:
        return say("just_now")
    if secs < 3600:
        return say("minute") if secs < 120 else say("minutes", n=int(secs // 60))
    if secs < 86400:
        return say("hours", n=int(secs // 3600))
    return say("days", n=int(secs // 86400))


def _all(root: Path, key: str = KEY, track: str | None = None) -> list[dict]:
    if track and key in state.TRACKED:
        got = state.tracked(root, key, track, [])
    else:
        got = state.get(root, key, [])
    return got if isinstance(got, list) else []


def live(root: Path, key: str = KEY, track: str | None = None) -> list[dict]:
    return [p for p in _all(root, key, track) if not p.get("struck")]


def add(root: Path, fact: str, at: str, limit: int, supersedes: int | None = None,
        where: dict | None = None, key: str = KEY, long: str = ""):
    fact = " ".join(fact.split())
    if not fact:
        return False, say("needs_fact")
    over = refused(fact, limit)
    if over:
        return False, over
    made = {"fact": fact, "at": at, "struck": None, **(where or {})}
    # THE RECORD IS SHARED, so the load and the save are one held operation. Two sessions
    # pinning at once each loaded eight and each wrote nine, and one pin was gone with
    # nothing to show for it — the silent loss this module's docstring swears against.
    noun = "rule" if key == RULES else "pin"
    with state.locked(root):
        items = _all(root, key)
        if supersedes is not None:
            i = supersedes - 1
            if i < 0 or i >= len(items):
                return False, say("no_such", noun=noun, n=supersedes, key=key)
            if items[i].get("struck"):
                return False, say("already_struck", noun=noun, n=supersedes, why=items[i]["struck"])
            items[i]["struck"] = fact
            items.append({**made, "replaced": supersedes})
            state.put(root, key, items)
            return True, say("replacing", noun=noun, n=len(items), old=supersedes)
        items.append(made)
        state.put(root, key, items)
        standing = len([p for p in items if not p.get("struck")])
    verb = "ruled" if key == RULES else "pinned"
    out = say("added", verb=verb, n=len(items), standing=standing)
    if (long or "").strip():
        ok, msg = write_body(root, len(items), long, key, at)
        out += say("added_body", msg=msg)
    else:
        # TAUGHT WHERE IT IS NEEDED: the claim has just landed and its argument is still in
        # the window. This is the last moment it is cheap to write down.
        out += say("added_hint", key=key, n=len(items))
    return True, out


# ─────────────────────────────── the long form of a claim ──────────────────────────────────
#: A CLAIM IS ONE LINE AND ITS REASONING IS NOT. The cap exists because a rule is re-read in
#: full at every session start, every compaction, every context rung and by every subagent —
#: 125 rules is 30KB of that in a real consumer. But the reasoning has to go SOMEWHERE, and
#: for want of anywhere it went into docs: 78 of them, 60 cited by nothing, and a rule citing
#: a doc that exists while the doc is referenced by the rule, so neither could ever be
#: retired. The body ends that. It belongs to the claim, it is never injected, it has no cap
#: — text that is never re-read costs nothing to keep — and it dies when the claim is struck.
#:
#: A FILE, NOT A FIELD. record.json is 744KB in that consumer, JSON has no multi-line
#: strings, and a person edits these by hand and reviews them in a diff. A to-do's brief and
#: a doc's part are both files for the same reasons; a third shape here would be inventing a
#: store this package has already rejected twice.
STRUCK = "struck"


def body_dir(root: Path, key: str = KEY, track: str | None = None) -> Path:
    if key == RULES:
        return root / "rules"
    return state.env_dir(root, track or state.current_track(root)) / "pins"


def _slug(text: str, limit: int = 40) -> str:
    import re as _re
    s = _re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return (s[:limit].rstrip("-") or "claim")


def body_path(root: Path, n: int, fact: str, key: str = KEY) -> Path:
    return body_dir(root, key) / f"{n:03d}-{_slug(fact)}.md"


def body(root: Path, n: int, key: str = KEY, track: str | None = None) -> str:
    items = _all(root, key, track)
    if n < 1 or n > len(items):
        return ""
    name = items[n - 1].get("body")
    if not name:
        return ""
    f = body_dir(root, key, track) / name
    return f.read_text() if f.is_file() else ""


def write_body(root: Path, n: int, text: str, key: str = KEY, at: str = "") -> tuple[bool, str]:
    noun = "rule" if key == RULES else "pin"
    if not (text or "").strip():
        return False, say("needs_body")
    with state.locked(root):
        items = _all(root, key)
        if n < 1 or n > len(items):
            return False, say("no_such", noun=noun, n=n, key=key)
        item = items[n - 1]
        f = body_dir(root, key) / (item.get("body") or body_path(root, n, item["fact"], key).name)
        if f.is_file():
            box = f.parent / STRUCK
            box.mkdir(parents=True, exist_ok=True)
            (box / f"{f.stem}-{(at or '').replace(':', '')}.md").write_text(f.read_text())
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(text.strip() + "\n")
        item["body"] = f.name
        state.put(root, key, items)
    return True, say("body_written", noun=noun, n=n, path=f.relative_to(root.parent))


def amend_body(root: Path, n: int, title: str, text: str, key: str = KEY, at: str = "") -> tuple[bool, str]:
    title = " ".join((title or "").split())
    if not title:
        return False, say("needs_section", key=key, n=n)
    had = body(root, n, key)
    if ("## " + title).lower() in had.lower():
        return False, say("has_section", title=repr(title))
    joined = (had.rstrip() + "\n\n" if had.strip() else "") + say("section", title=title, text=text.strip())
    ok, msg = write_body(root, n, joined, key, at)
    return ok, (msg + say("section_added", title=repr(title)) if ok else msg)


#: Paths that exist for one session. A pin naming one is a citation to nothing: the
#: scratchpad is `/private/tmp/…/<session id>/scratchpad`, a different directory for every
#: session, and the OS clears it besides. Measured: "Reactivity groundwork report is at
#: scratchpad/reactivity-groundwork.md" — the report was real, and no later reader could
#: open it. A report worth a pin belongs in the repo; its claims belong in pins.
VOLATILE = ("scratchpad", "/tmp/", "/private/tmp", "/var/folders/")


def refused(fact: str, limit: int) -> str | None:
    fact = " ".join(fact.split())
    low = fact.lower()
    hit = next((v for v in VOLATILE if v in low), None)
    if hit:
        return say("volatile", hit=repr(hit))
    over = entries.capped(fact, limit)
    if not over:
        return None
    length, keep, cut = over
    return say("too_long", length=length, limit=limit, keep=keep, cut=cut)


def strike(root: Path, n: int, why: str, key: str = KEY, at: str = "") -> tuple[bool, str]:
    return entries.retire(root, _store(key), n, why, at)


def move(root: Path, n: int, dst: str, at: str) -> tuple[bool, str]:
    return entries.move(root, _store(KEY), n, dst, at)


def promote(root: Path, n: int, at: str, where: dict | None = None) -> tuple[bool, str]:
    with state.locked(root):
        items = _all(root)
        i = n - 1
        if i < 0 or i >= len(items):
            return False, say("no_such", noun="pin", n=n, key=KEY)
        if items[i].get("struck"):
            return False, say("already_struck", noun="pin", n=n, why=items[i]["struck"])
        rules = _all(root, RULES)
        rules.append({"fact": items[i]["fact"], "at": at, "struck": None,
                      **{k: items[i][k] for k in ("line", "session", "doc") if k in items[i]},
                      "promoted_from": n, **(where or {})})
        items[i]["struck"] = say("promoted_to", n=len(rules))
        state.put(root, RULES, rules)
        state.put(root, KEY, items)
        # THE REASONING GOES WITH THE CLAIM. Copying the fact and leaving the body behind
        # would drop the argument silently while the strike reason says it went to rule N —
        # and the pin's file is about to belong to an environment the rule does not.
        carried = body(root, n, KEY)
    if carried.strip():
        write_body(root, len(rules), carried, RULES, at)
    return True, say("promoted", n=len(rules), pin=n, fact=items[i]["fact"][:70])


def listing(root: Path, *, all_of_them: bool = False, key: str = KEY,
            cap: int | None = None, page: int = 1, order: str = fmt.DESC,
            track: str | None = None):
    import entries
    return entries.rows(root, _store(key, root), all_of_them=all_of_them, cap=cap,
                        page=page, order=order, track=track)


def rows_response(root: Path, *, all_of_them: bool = False, key: str = KEY,
                  cap: int | None = None, page: int = 1, order: str = fmt.DESC,
                  track: str | None = None) -> tuple[list[dict], int]:
    items, left = listing(root, all_of_them=all_of_them, key=key, cap=cap, page=page,
                          order=order, track=track)
    return [{"n": it.n, "fact": it.text, "meta": it.meta, "struck": it.struck} for it in items], left


def render(root: Path, *, all_of_them: bool = False, key: str = KEY, width: int | None = None,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    width = fmt.room(width)
    if not _all(root, key):
        return say("no_rules" if key == RULES else "no_pins")
    rows, left = rows_response(root, all_of_them=all_of_them, key=key, cap=cap, page=page, order=order)
    items = [fmt.Item(n=r["n"], text=r["fact"], meta=r["meta"], struck=r["struck"]) for r in rows]
    return fmt.render(fmt.Out(items=tuple(items))) + fmt.more(key, left, page, order)


def around(root: Path, n: int, project: Path, spread: int, key: str = KEY) -> tuple[bool, str]:
    import transcript
    noun = "rule" if key == RULES else "pin"
    items = _all(root, key)
    if n < 1 or n > len(items):
        return False, say("no_such_all", noun=noun, n=n, key=key)
    p = items[n - 1]
    if not p.get("line"):
        return False, say("before_lines", noun=noun, n=n, fact=p["fact"])
    want = p.get("session")
    path = None
    if want:
        cand = transcript.project_dir(project) / want
        path = cand if cand.is_file() else None
    path = path or transcript.newest_session(project)
    if path is None:
        return False, say("transcript_gone")
    if want and path.name != want:
        note = say("note_gone", want=want)
    elif p.get("via") == "delegation":
        note = say("note_delegated")
    elif p.get("guessed"):
        note = say("note_guessed")
    else:
        note = ""
    lines, _ = transcript.read(path)
    here = p["line"]
    # COUNTED IN MESSAGES, NOT IN LINE NUMBERS. A pin is written BY a tool call, so the
    # lines either side of it are that call and its output — measured, the first version
    # printed "nothing was said around that line" for a pin whose conversation was four
    # tool results away. What a reader wants is the nearest MESSAGES, and mostly the ones
    # before: a pin is written after the thing it is about was said.
    spoken = [l for l in lines if l.spoken and (l.text or "").strip()]
    before = [l for l in spoken if l.n <= here][-(spread + 1):]
    after = [l for l in spoken if l.n > here][:max(1, spread // 2)]
    keep = before + after
    edge = before[-1].n if before else here
    body = []
    for l in keep:
        mark = "▸ USER" if l.kind == "human" else "      "
        text = " ".join((l.text or "").split())
        # The pin sits AFTER the last message before it, never on one, so the marker goes
        # on that message rather than pretending a line was the pin itself.
        body.append(say("around_line", edge=">>" if l.n == edge else "  ", n=str(l.n).rjust(6), mark=mark, text=text[:400]))
    title = fmt.title(say("around_title", noun=noun.upper(), n=n), sub=say("around_sub", line=here))
    return True, say("around", title=title, note=note, fact=p["fact"],
                     body="\n".join(body) if body else say("around_empty"))


def carry(root: Path, source: str = "compact", key: str = KEY, cap: int = 0,
          brief: bool = False) -> str:
    # THE NUMBER IS THE POSITION IN THE FULL LIST, and here it was not. `render` numbers
    # over every entry so a struck one keeps its number; this block numbered over the LIVE
    # ones, so `·pins show 3` in a session's start block pointed at a different pin from
    # `journal pins show 3` the moment anything had been struck. Same defect the reading
    # pass had, in the other direction.
    numbered = [(i, p) for i, p in enumerate(_all(root, key), 1) if not p.get("struck")]
    if not numbered:
        return ""
    # CAPPED, AND THE CAP SAYS SO. See `fmt.cut`: the store keeps everything, one injection
    # may not, and the line that reports the trim is what keeps the old promise honest.
    total = len(numbered)
    if cap and total > cap:
        numbered = numbered[-cap:]
    head = say("head_rules" if key == RULES else "head_compact" if source == "compact" else "head_start")
    noun = "rules" if key == RULES else "pins"
    rows = [say("carry_row", fact=fmt.gist(p["fact"]) if brief else p["fact"], age=age(p.get("at", "")),
                noun=noun, body=i if p.get("body") else None,
                doc=(say("doc_ref", doc=p["doc"]) if brief else _doc_label(root, p["doc"])) if p.get("doc") else None)
            for i, p in numbered]
    return say("carry", head=head, rows=rows, more=fmt.cut(len(numbered), total, f"journal {noun}", shortened=brief))
