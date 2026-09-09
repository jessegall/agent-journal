"""A fact that must reach the far side of every compaction.

A TAG IS FREE. A PIN IS NOT. A tag rides on a message you were sending anyway; a pin rides
on nothing and is restored, in full, on the far side of every compaction — so it costs
room in the context it lands in, and only the far side can ever spend it.

IT DOES NOT SHAPE THE SUMMARY. The summariser cannot be addressed at all (see
`hook.on_pre_compact`); a pin is handed back AFTER the loss, beside the summary, never
inside it.

AND IT NEVER EVICTS, AND NEVER TRIMS. There is no cap on how many stand and no cap on
how many are handed over: every standing pin and rule reaches the far side, always. The
only limit is on the LENGTH of one entry, enforced when it is written. The tool this
replaces dropped the oldest silently, and the pin it ate — "DO NOT ACT ON status's
Running LIST" — cost a real build two hours of a wrong board. A tier that silently forgets
is the exact failure the whole system exists to prevent, so nothing leaves the store
except by a person striking it, with a reason.

THE TEST, three questions: did somebody DECIDE it; would the next reader get it WRONG
without it; will it still be true tomorrow? A status, a count, or what you just did fails
the third and becomes a confident falsehood wearing the same authority as the facts that
still hold.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import entries
import fmt
import docs as docs_mod
import state

KEY = "pins"


def _store(key: str = KEY, root: Path | None = None):
    """What `entries` needs to know about a pin — or a rule, which is a pin everywhere.

    `facts` closes over the root and the key because the line beneath a pin cites a doc by
    its label, which only the record can resolve. The signature stays uniform — every
    store's `facts` is `(entry, number) -> fragments` — so `entries.rows` never learns
    which noun it is holding.
    """
    import entries
    noun = "rule" if key == RULES else "pin"

    def facts(p: dict, n: int) -> list[str]:
        out = []
        if p.get("struck"):
            out.append(f"struck: {p['struck']}")
        if age(p.get("at", "")):
            out.append(age(p.get("at", "")))
        out.append(f"line {p['line']}" if p.get("line") else "before lines were kept")
        if p.get("replaced"):
            out.append(f"replaces {p['replaced']}")
        if p.get("promoted_from"):
            out.append(f"promoted from pin {p['promoted_from']}")
        if p.get("body"):
            out.append(f"has its reasoning ({key} show {n})")
        if p.get("doc") and root is not None:
            out.append("→ " + docs_mod.ref_label(root, str(p["doc"])))
        return out

    return entries.Store(key=key, noun=noun, text="fact", retired="struck",
                         verb="struck", facts=facts)
#: A RULE IS A PIN FOR EVERY ENVIRONMENT. Pins say what this line of work decided; a rule says
#: what the project decided, and `tracks.switch` never moves it. Same shape, same cap,
#: same citation into the transcript — one more question before writing one: would it
#: be wrong on any OTHER environment? If only on this one, it is a pin.
RULES = "rules"


def age(at: str, now: datetime | None = None) -> str:
    """How long this fact has been asserted, in the coarsest honest unit.

    THE ONE PLACE THIS SYSTEM ASKS TO BE TRUSTED. Everything else here fails by being
    absent — an untagged message files nothing, a hook that never runs holds nothing,
    `work.note` refuses rather than guessing. A pin is the exception: it is re-asserted
    verbatim at the top of every compaction, in the highest-authority position the system
    has, and nothing revisits it. `pins.py` states the test in its own docstring — will it
    still be true tomorrow — and then never asks again.

    So the age is SHOWN and nothing is expired. A date invites the question; it does not
    answer it. Automatic eviction is the failure this module exists to prevent, and a
    stale pin you can see beats a true one that silently vanished.

    Unreadable timestamps return "" rather than a guess: a wrong age on a true fact is
    the same confident falsehood the whole exercise is against.
    """
    try:
        when = datetime.fromisoformat((at or "").replace("Z", "+00:00"))
    except ValueError:
        return ""
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    secs = ((now or datetime.now(timezone.utc)) - when).total_seconds()
    if secs < 3600:
        return "just now"
    if secs < 86400:
        return f"{int(secs // 3600)}h ago"
    return f"{int(secs // 86400)}d ago"


def _all(root: Path, key: str = KEY) -> list[dict]:
    got = state.get(root, key, [])
    return got if isinstance(got, list) else []


def live(root: Path, key: str = KEY) -> list[dict]:
    return [p for p in _all(root, key) if not p.get("struck")]


def add(root: Path, fact: str, at: str, limit: int, supersedes: int | None = None,
        where: dict | None = None, key: str = KEY, long: str = ""):
    """Pin a fact. Refuses a paragraph, and records where it was said.

    THE LIMIT IS ON LENGTH, NOT ON COUNT, and that is the whole change. A pin is re-read in
    full at every compaction forever, so what it costs is not a slot — it is the reader's
    attention, every single time. A 380-character pin was three facts and a rationale
    wearing one number; refusing it costs the writer one sentence of thought and saves
    every future reader the paragraph.

    The refusal SHOWS THE OVERFLOW rather than truncating, because a pin silently cut in
    half is a fact that reads as complete and is not.
    """
    fact = " ".join(fact.split())
    if not fact:
        return False, "pin what? one line: the fact, and what makes it matter"
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
                return False, f"there is no {noun} {supersedes}. `journal {key}` numbers them."
            if items[i].get("struck"):
                return False, f"{noun} {supersedes} is already struck by: {items[i]['struck']}"
            items[i]["struck"] = fact
            items.append({**made, "replaced": supersedes})
            state.put(root, key, items)
            return True, f"{noun} {len(items)}, replacing {supersedes}"
        items.append(made)
        state.put(root, key, items)
        standing = len([p for p in items if not p.get("struck")])
    verb = "ruled" if key == RULES else "pinned"
    out = f"{verb} {len(items)} ({standing} standing)"
    if (long or "").strip():
        ok, msg = write_body(root, len(items), long, key, at)
        out += "\n  " + msg
    else:
        # TAUGHT WHERE IT IS NEEDED: the claim has just landed and its argument is still in
        # the window. This is the last moment it is cheap to write down.
        out += f"\n  the reasoning behind it: journal {key} replace {len(items)} --brief"
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


def body_dir(root: Path, key: str = KEY) -> Path:
    """Where the long forms live: beside the rules, or inside the environment for pins."""
    if key == RULES:
        return root / "rules"
    return state.env_dir(root, state.get(root, "current", "default") or "default") / "pins"


def _slug(text: str, limit: int = 40) -> str:
    import re as _re
    s = _re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return (s[:limit].rstrip("-") or "claim")


def body_path(root: Path, n: int, fact: str, key: str = KEY) -> Path:
    return body_dir(root, key) / f"{n:03d}-{_slug(fact)}.md"


def body(root: Path, n: int, key: str = KEY) -> str:
    """The long form of claim n, or "" when it has none."""
    items = _all(root, key)
    if n < 1 or n > len(items):
        return ""
    name = items[n - 1].get("body")
    if not name:
        return ""
    f = body_dir(root, key) / name
    return f.read_text() if f.is_file() else ""


def write_body(root: Path, n: int, text: str, key: str = KEY, at: str = "") -> tuple[bool, str]:
    """Give claim n a long form, or replace the one it has. The old text is kept under struck/."""
    noun = "rule" if key == RULES else "pin"
    if not (text or "").strip():
        return False, f"a long form needs a body — pass it on stdin with --brief"
    with state.locked(root):
        items = _all(root, key)
        if n < 1 or n > len(items):
            return False, f"there is no {noun} {n}. `journal {key}` numbers them."
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
    return True, f"{noun} {n} has its reasoning: {f.relative_to(root.parent)}"


def amend_body(root: Path, n: int, title: str, text: str, key: str = KEY, at: str = "") -> tuple[bool, str]:
    """Append a `## <title>` section to the long form, leaving what is there."""
    title = " ".join((title or "").split())
    if not title:
        return False, f'a section needs a title: journal {key} amend {n} "<section title>" --brief'
    had = body(root, n, key)
    if f"## {title.lower()}" in had.lower():
        return False, f"that long form already has a section called {title!r}"
    joined = (had.rstrip() + "\n\n" if had.strip() else "") + f"## {title}\n\n{text.strip()}"
    ok, msg = write_body(root, n, joined, key, at)
    return ok, (msg + f"\n  added the section {title!r}" if ok else msg)


#: Paths that exist for one session. A pin naming one is a citation to nothing: the
#: scratchpad is `/private/tmp/…/<session id>/scratchpad`, a different directory for every
#: session, and the OS clears it besides. Measured: "Reactivity groundwork report is at
#: scratchpad/reactivity-groundwork.md" — the report was real, and no later reader could
#: open it. A report worth a pin belongs in the repo; its claims belong in pins.
VOLATILE = ("scratchpad", "/tmp/", "/private/tmp", "/var/folders/")


def refused(fact: str, limit: int) -> str | None:
    """Why this pin cannot be written, or None. ONE text, said in two places.

    The CLI says it after the command ran and exited 1, which a reader can skim past.
    The PreToolUse gate says it BEFORE the command runs, as a denied tool call, which a
    reader cannot — and the two must be the same words, or the gate and the command would
    disagree about the rule they share.
    """
    fact = " ".join(fact.split())
    low = fact.lower()
    hit = next((v for v in VOLATILE if v in low), None)
    if hit:
        return (
            f"this pin cites {hit!r}, a path that exists for one session only — it will "
            f"point at nothing tomorrow, which fails the test a pin has to pass. Put the "
            f"file in the repo and cite that, or pin its CLAIMS instead of its location."
        )
    if not limit or len(fact) <= limit:
        return None
    return (
        f"{len(fact)} characters, and a pin has {limit}. This is re-read in full at "
        f"every compaction, so it has to be a CLAIM, not the reasoning behind it:\n"
        f"  keep  …{fact[:limit - 20]}\n"
        f"  cut   …{fact[limit - 20:][:120]}\n"
        "The reasoning is not cut, it is MOVED: `--brief` on the same command takes it on "
        "stdin, and only the claim is printed into context. `journal pins show <n>` reads "
        "it back. Several claims are still several pins."
    )


def strike(root: Path, n: int, why: str, key: str = KEY) -> tuple[bool, str]:
    """Retire a pin that has simply STOPPED BEING TRUE, without inventing a replacement.

    `--supersedes` already struck a pin, but only by putting another one in its place — it
    answers "this fact changed". It has no answer for "this fact expired", and the first
    stale pin proved it: a spent probe number, true when written, dead an hour later, with
    nothing to replace it. Retiring it through `--supersedes` would have meant writing a
    fact I did not have in order to delete one I did not want, and a store that makes you
    invent an entry to remove an entry will accumulate inventions.

    THE REASON IS REQUIRED, and it is the whole safeguard — see `entries.retire`, which is
    where that safeguard lives for every store that has it.
    """
    return entries.retire(root, _store(key), n, why)


def move(root: Path, n: int, dst: str, at: str) -> tuple[bool, str]:
    """Move a pin to another environment. Struck here, added there — see `entries.move`.

    Rules are not moved by this: a rule binds every environment, so there is nowhere to move
    it to. That refusal lives at the CLI, where the noun is known.
    """
    return entries.move(root, _store(KEY), n, dst, at)


def promote(root: Path, n: int, at: str, where: dict | None = None) -> tuple[bool, str]:
    """Lift a pin into a rule: the same claim, now for every environment.

    THE PIN IS STRUCK, NOT COPIED. Two entries carrying one claim would drift — one gets
    superseded, the other does not — and the far side would be handed both. The strike
    reason names the rule, so `pins --all` still shows where the claim went.
    """
    with state.locked(root):
        items = _all(root)
        i = n - 1
        if i < 0 or i >= len(items):
            return False, f"there is no pin {n}. `journal pins` numbers them."
        if items[i].get("struck"):
            return False, f"pin {n} is already struck by: {items[i]['struck']}"
        rules = _all(root, RULES)
        rules.append({"fact": items[i]["fact"], "at": at, "struck": None,
                      **{k: items[i][k] for k in ("line", "session", "doc") if k in items[i]},
                      "promoted_from": n, **(where or {})})
        items[i]["struck"] = f"promoted to rule {len(rules)}"
        state.put(root, RULES, rules)
        state.put(root, KEY, items)
        # THE REASONING GOES WITH THE CLAIM. Copying the fact and leaving the body behind
        # would drop the argument silently while the strike reason says it went to rule N —
        # and the pin's file is about to belong to an environment the rule does not.
        carried = body(root, n, KEY)
    if carried.strip():
        write_body(root, len(rules), carried, RULES, at)
    return True, f"rule {len(rules)}, from pin {n}: {items[i]['fact'][:70]}"


def listing(root: Path, *, all_of_them: bool = False, key: str = KEY,
            cap: int | None = None, page: int = 1, order: str = fmt.DESC):
    """(the rows, how many were left off). What a page is BUILT from — see `entries.rows`.

    A page that is handed rendered TEXT can only print it; one handed rows can put them
    under a heading, beside a footer, inside a section. The catalogue pages take these, and
    `render` below is for the two callers that genuinely want a finished string.
    """
    import entries
    return entries.rows(root, _store(key, root), all_of_them=all_of_them, cap=cap,
                        page=page, order=order)


def render(root: Path, *, all_of_them: bool = False, key: str = KEY, width: int = 88,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    """The list as a person reads it. See `entries.rows` — the loop is shared with every
    other numbered store, and only what goes BENEATH an entry is this module's."""
    import entries
    if not _all(root, key):
        return "  No rules stand." if key == RULES else "  Nothing is pinned."
    items, left = entries.rows(root, _store(key, root), all_of_them=all_of_them,
                               cap=cap, page=page, order=order)
    return fmt.render(fmt.Out(items=tuple(items))) + fmt.more(key, left, page, order)


def around(root: Path, n: int, project: Path, spread: int, key: str = KEY) -> tuple[bool, str]:
    """The conversation around where a pin was written — the reasoning it deliberately omits.

    THIS IS WHY THE PIN CAN BE SHORT. The claim is the pin; the argument is here, in the
    transcript, unedited and in the words both people actually used. Nothing is copied
    between them, so they cannot drift apart.

    A pin from before line numbers were kept SAYS SO instead of guessing at a location. An
    index that points confidently at the wrong page is worse than one that admits a gap.
    """
    import transcript
    noun = "rule" if key == RULES else "pin"
    items = _all(root, key)
    if n < 1 or n > len(items):
        return False, f"there is no {noun} {n}. `journal {key} --all` numbers them."
    p = items[n - 1]
    if not p.get("line"):
        return False, (
            f"{noun} {n} was written before pins recorded where they were said, so there is "
            f"nothing to read around. The fact still stands:\n  {p['fact']}"
        )
    want = p.get("session")
    path = None
    if want:
        cand = transcript.project_dir(project) / want
        path = cand if cand.is_file() else None
    path = path or transcript.newest_session(project)
    if path is None:
        return False, "that pin names a transcript this machine no longer has."
    if want and path.name != want:
        note = f"  ! the session it was written in ({want}) is gone; reading the newest instead\n"
    elif p.get("via") == "delegation":
        note = ("  ! written while the environment was DELEGATED: the writer may have been a subagent,\n"
                "    whose words are one level under this transcript, in its subagents/ folder\n")
    elif p.get("guessed"):
        note = "  ! the transcript was GUESSED when this pin was written (no session id in the\n" \
               "    environment); the citation may point at another terminal's conversation\n"
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
        body.append(f"{'>>' if l.n == edge else '  '}{l.n:>6}  {mark}  {text[:400]}")
    return True, (
        fmt.title(f"{noun.upper()} {n}", sub=f"written at line {here}") + f"\n{note}\n  {p['fact']}\n\n"
        + ("\n".join(body) if body else "  (nothing was said around that line)")
        + "\n\n  >> marks the line it was pinned at. journal conversation --back=N reads further."
    )


def carry(root: Path, source: str = "compact", key: str = KEY, cap: int = 0) -> str:
    """What a compaction cannot be trusted to keep, handed back AFTER it. Empty if none.

    Not "told to keep" — the summariser is unreachable, so this never shapes the summary.
    It is restored on the far side, at SessionStart, which is the only door that opens.
    The wording says so, because a page claiming a side effect it no longer has is the
    defect this whole system is a reaction to.

    THE HEADER DEPENDS ON WHAT JUST HAPPENED. The journal is shared by every session, so
    the pins are delivered at every start — and a fresh session is holding no summary. A
    header that says "the summary you are holding" to a session that has none is a claim
    about an event that did not happen, in the highest-authority position the system has.
    """
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
    if key == RULES:
        head = "RULES OF THIS PROJECT, on every environment. Decided, and still in force:"
    elif source == "compact":
        head = ("FACTS THE SUMMARY YOU ARE HOLDING DID NOT KEEP. They were true before the "
                "compaction and are true now:")
    else:
        head = "FACTS THAT STAND ON THIS ENVIRONMENT, decided in earlier sessions and still true:"
    noun = "rules" if key == RULES else "pins"
    return (
        head + "\n"
        + "\n".join(
            f"  - {p['fact']}" + (f"  [{age(p.get('at', ''))}]" if age(p.get("at", "")) else "")
            # THE MARKER IS ONE SUFFIX, because this block is the scarcest text in the
            # system: a reader who wants the argument is told, in the fewest characters
            # that can carry a command, where it is.
            + (f"  ·{noun} show {i}" if p.get("body") else "")
            + (f"  → {docs_mod.ref_label(root, str(p['doc']))}" if p.get("doc") else "")
            for i, p in numbered
        )
        + fmt.cut(len(numbered), total, f"journal {noun}")
    )
