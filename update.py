"""Versions, the changelog, and the upgrade: how a project learns the journal has moved on.

THE UPGRADE IS `install --from` POINTED AT THE PUBLIC REPO: a shallow clone into a temp
directory, its suites run there, and only then the package copied over — the record,
settings, runtime, to-dos and docs of this project untouched. What this module adds is
knowing that an upgrade EXISTS and what it brings: the changelog entries between the
version a project had and the one it got, printed at upgrade and handed to each session
once, because a feature nobody was told about is one nobody uses.

THE CHECK IS QUIET AND RARE. Once a day at most, a few seconds at most, and a network
that is down is a check that did not happen — never an error in front of the agent.
"""
from __future__ import annotations

import json
import re
import subprocess
import tempfile
import time
from pathlib import Path

REPO = "https://github.com/jessegall/agent-journal"
RAW = "https://raw.githubusercontent.com/jessegall/agent-journal/main"
CACHE = "runtime/upstream.cache"     # gitignored, project-wide: one check serves every session; not a .json, so verify does not count it as a transcript


def current(root: Path) -> str:
    f = root / "VERSION"
    return f.read_text().strip() if f.is_file() else "0.0.0"


def _tuple(v: str) -> tuple:
    return tuple(int(x) for x in re.findall(r"\d+", v)[:3]) or (0,)


def newer(a: str, b: str) -> bool:
    return _tuple(a) > _tuple(b)


def entries(text: str) -> list[tuple[str, str, str]]:
    """(version, headline, body) for every `## <version> — <headline>` section, newest first."""
    out = []
    parts = re.split(r"^## +", text, flags=re.M)[1:]
    for part in parts:
        head, _, body = part.partition("\n")
        m = re.match(r"([\d.]+)\s*(?:[—-]\s*(.*))?", head.strip())
        if m:
            out.append((m.group(1), (m.group(2) or "").strip(), body.strip()))
    return out


def since(text: str, had: str) -> list[tuple[str, str, str]]:
    return [e for e in entries(text) if newer(e[0], had)]


def render_since(text: str, had: str, now: str) -> str:
    got = since(text, had)
    if not got:
        return ""
    lines = [f"THE JOURNAL WAS UPGRADED: {had} → {now}. What changed, newest first:"]
    for v, head, body in got:
        lines.append(f"\n{v} — {head}" if head else f"\n{v}")
        lines.append(body)
    lines.append("\nRELOAD THE JOURNAL SKILL NOW — invoke the `journal` skill again — because its "
                 "rules and commands changed with this version and what you remember of it is stale.")
    return "\n".join(lines)


# ------------------------------------------------------------------ the check
def _fetch(url: str, timeout: float = 3.0) -> str | None:
    try:
        # IMPORTED HERE, NOT AT THE TOP. `urllib.request` costs 13ms to import and pulls in
        # http.client and the email package behind it — on a CLI whose whole run is 79ms,
        # and which is spawned a couple of thousand times by the suites alone. Almost no
        # invocation ever reaches the network.
        import urllib.request
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return r.read().decode("utf-8", "replace")
    except Exception:
        return None


#: HOW LONG AN ANSWER STANDS. The check used to run on every command, on the ruling that
#: every check asks the repository — and the cost of that ruling was not visible until a real
#: project measured it: a bare `journal` took 4.5 seconds of which 3 were network, and a
#: single turn fires the hook at session start, at the prompt and at the stop, so the same
#: two round trips were paid three or more times for one exchange. The user's revised
#: ruling: fifteen minutes. A version that went up eleven minutes ago can wait four more.
CACHE_SECONDS = 900


def check(root: Path, force: bool = False) -> dict:
    """{'version': latest upstream, 'headline': …} — cached for CACHE_SECONDS; `force` asks now."""
    f = root / CACHE
    cached = {}
    if f.is_file():
        try:
            cached = json.loads(f.read_text())
        except ValueError:
            cached = {}
    import os
    if os.environ.get("AGENT_JOURNAL_OFFLINE"):
        return cached  # the test suites, and anyone who wants no network from a hook
    fresh = cached.get("at") and (time.time() - cached["at"]) < CACHE_SECONDS
    if fresh and not force:
        return cached
    version = _fetch(f"{RAW}/VERSION", timeout=2.0)
    if version is None:
        cached.setdefault("version", "")
    else:
        version = version.strip()
        # THE CHANGELOG IS 124KB AND IS ONLY READABLE WHEN THERE IS SOMETHING TO READ. It
        # was fetched on every successful check, up to date or not, to find a headline that
        # is thrown away unless the version is newer — so the overwhelmingly common case,
        # a project that is current, paid the whole file to learn nothing.
        head = ""
        if newer(version, current(root)):
            log = _fetch(f"{RAW}/CHANGELOG.md")
            if log:
                got = entries(log)
                head = got[0][1] if got and got[0][0] == version else ""
        cached = {"version": version, "headline": head, "at": time.time()}
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(cached))
    return cached


def available(root: Path) -> tuple[str, str]:
    """(the sentence to say, the version it names) — or ("", "") when this project is current.

    ONE CALL, TWO ANSWERS. The stop hook wanted both — the line to print, and the version to
    compare against what it said last time — and asked twice: `notice()` and then `check()`,
    each a round trip of its own before there was a cache. Two questions about one fact are
    one function.
    """
    got = check(root)
    have = current(root)
    if not (got.get("version") and newer(got["version"], have)):
        return "", ""
    head = f" — {got['headline']}" if got.get("headline") else ""
    return (f"AGENT-JOURNAL {got['version']} IS AVAILABLE (this project has {have}){head}. "
            "`journal upgrade` pulls it, runs its tests first, and prints what changed.",
            got["version"])


def notice(root: Path) -> str:
    """One line if a newer version is upstream, else empty."""
    return available(root)[0]


# ------------------------------------------------------------------ the upgrade
def upgrade(root: Path, source: str | None = None) -> tuple[bool, str]:
    """Pull the package from the public repo (or a path), and say what changed."""
    import install
    had = current(root)
    src = source or REPO
    tmp = None
    if re.match(r"^(https?://|git@|ssh://)", src) or src.endswith(".git"):
        tmp = Path(tempfile.mkdtemp())
        p = subprocess.run(["git", "clone", "--quiet", "--depth", "1", src, str(tmp / "pkg")],
                           capture_output=True, text=True)
        if p.returncode != 0:
            return False, f"could not clone {src}:\n{p.stderr.strip()}"
        src = str(tmp / "pkg")
    try:
        lines = install.pull(Path(src), check=False)
    except SystemExit as e:
        return False, str(e)
    for line in install.skill(False):
        lines.append(line)
    # AN EVENT THE NEW VERSION LISTENS TO IS WIRED BY THE UPDATE, and one it has RETIRED is
    # unwired. Idempotent: what is already right is left alone.
    #
    # RELOADED FIRST, because `install` was imported before `pull` replaced it on disk and the
    # module in memory is the OLD one. Measured: 1.57.0 retired `WorktreeCreate`, the upgrade
    # ran the previous `wire()`, and the event stayed in settings.json until something else
    # happened to call it — so the release that removes a broken hook would not remove it, in
    # exactly the projects it is broken in.
    import importlib
    install = importlib.reload(install)
    for line in install.wire(False):
        if line.startswith(("  +", "  -")):
            lines.append(line)
    now = current(root)
    (root / CACHE).unlink(missing_ok=True)  # the next check is a real one
    out = "\n".join(lines)
    if newer(now, had):
        log = (root / "CHANGELOG.md").read_text() if (root / "CHANGELOG.md").is_file() else ""
        out += "\n\n" + render_since(log, had, now)
        # every session started from now on is handed the same, once
        import state
        with state.locked(root):
            state.put(root, "upgraded", {"from": had, "to": now})
        # AND THE RECORD IS BROUGHT WITH IT. The upgrade is the moment the code changed, so
        # it is the moment the shape it expects has to exist — not the next command, and not
        # a step in a changelog entry somebody reads later.
        import migrate
        ran = migrate.run(root)
        if ran:
            out += "\n\n  Migrated:\n" + "\n".join(f"  {l}" for l in ran)
    elif now == had:
        out += f"\n\n  Already at {now}."
    return True, out
