#!/usr/bin/env python3
"""A record written by an older version is brought forward, by whoever notices first.

    .journal/test_migrate.py

The package is copied into consumers by file, not installed by a package manager, so
"the upgrade command ran the migration" is not a guarantee anybody has. What this suite
holds is the guarantee that IS available: the first process to read an old record migrates
it, twice is a no-op, and nothing that was there is lost on the way.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


#: THIS SUITE FAILED FOUR TIMES IN ONE DAY AND NEVER ON DEMAND. Every failure was inside a
#: batch, on a machine that was also running three dispatched agents; ninety runs afterwards
#: — alone, six at a time, and four full rounds of every suite in parallel — were green.
#:
#: SO IT IS TREATED AS LOAD, AND SAID SO RATHER THAN DRESSED UP AS LOGIC. Every command here
#: spawns a real CLI, and the package's own start is ~90ms before it does anything; a
#: 60-second ceiling is generous until a dozen of them are competing for the same disk, and
#: a timeout there raises inside `check`'s caller and is counted as a failed check with no
#: line printed — which is exactly the shape that was seen. The ceiling is 180s now.
#:
#: IF IT COMES BACK WITH THE NEW CEILING, the theory is wrong and the answer is elsewhere:
#: run the batch in a loop capturing full output per run, and do not close it again until a
#: failure has been caught with its own text beside it.


AT = "2026-09-01T00:00:00+00:00"


def project(with_record=True):
    """A checkout holding a record in the PRE-1.34.0 shape: pins in the blob, todo/ beside it."""
    d = Path(tempfile.mkdtemp()) / "proj"
    (d / ".claude").mkdir(parents=True)
    shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
        "runtime", "state.json*", "record.json*", "todo", "environments", "docs", "tools",
        ".journal", ".git", ".claude", "__pycache__"))
    (d / ".journal" / "settings.json").write_text("{}")
    t = transcript.project_dir(d); t.mkdir(parents=True, exist_ok=True)
    (t / "s1.jsonl").write_text("")
    if with_record:
        (d / ".journal" / "record.json").write_text(json.dumps({
            "current": "alpha",
            "tracks": {
                "alpha": {"pins": [{"fact": "a claim from the old shape", "at": AT, "struck": None}],
                          "work": [{"subject": "old work", "at": AT}], "at": AT},
                "beta": {"pins": [{"fact": "beta's own claim", "at": AT, "struck": None}], "work": [], "at": AT},
            },
            "rules": [{"fact": "a rule that must survive", "at": AT, "struck": None}],
        }, indent=1))
        for name in ("alpha", "beta"):
            p = d / ".journal" / "todo" / name
            p.mkdir(parents=True)
            (p / f"001-{name}.md").write_text(
                f"---\ntitle: a to-do on {name}\ntrack: {name}\nat: {AT}\n---\n\nthe brief\n")
    return d


def j(d, *args):
    env = {**os.environ, transcript.SESSION_ENV: "s1"}
    p = subprocess.run([str(d / ".journal" / "journal.py"), *args], env=env, cwd=str(d),
                       capture_output=True, text=True, timeout=180)
    return p.returncode, (p.stdout + p.stderr).strip()


# ─────────────────── the first command migrates, and everything still reads ────────────────
d = project()
code, out = j(d, "migrate")
check("status reports pending without acting on it",
      ("1 pending" in out, "1.34.0" in out), (True, True))

code, out = j(d, "pins")
check("the first ordinary command migrates on its way through",
      (code, "a claim from the old shape" in out), (0, True))

envs = d / ".journal" / "environments"
check("every environment now has its own folder, holding what is bound to it",
      (sorted(x.name for x in envs.iterdir()),
       (envs / "alpha" / "pins.json").is_file(),
       (envs / "alpha" / "work.json").is_file(),
       (envs / "alpha" / "todo" / "001-alpha.md").is_file()),
      (["alpha", "beta"], True, True, True))
check("and the old parallel todo/ tree is gone", (d / ".journal" / "todo").exists(), False)

rec = json.loads((d / ".journal" / "record.json").read_text())
check("the record keeps the REGISTRY and not the contents",
      (sorted(rec["tracks"]), "pins" in rec["tracks"]["alpha"], "work" in rec["tracks"]["alpha"]),
      (["alpha", "beta"], False, False))
check("rules are the project's and never moved", len(rec["rules"]), 1)

check("the pin reads back", "a claim from the old shape" in j(d, "pins")[1], True)
check("the to-do reads back", "a to-do on alpha" in j(d, "todos")[1], True)
check("the open work reads back", "old work" in j(d, "open")[1], True)
j(d, "switch", "beta")
check("and so does the other environment's, separately",
      ("beta's own claim" in j(d, "pins")[1], "a to-do on beta" in j(d, "todos")[1]), (True, True))

# ─────────────────────────────── it runs once, and only once ───────────────────────────────
code, out = j(d, "migrate")
check("nothing is pending afterwards", ("Nothing pending" in out, code), (True, 0))
code, out = j(d, "migrate", "run")
check("and running it again does nothing", (code, "Nothing pending" in out), (0, True))
before = (envs / "alpha" / "pins.json").read_text()
j(d, "pins")
check("a second pass leaves what it already moved exactly as it is",
      (envs / "alpha" / "pins.json").read_text(), before)

# ───────────────────────────── a fresh project skips the past ──────────────────────────────
d2 = project(with_record=False)
j(d2, "prepare", "fresh")
code, out = j(d2, "migrate")
check("a project that never had the old shape is already up to date",
      ("Nothing pending" in out, code), (True, 0))

# ────────────────────────── an environment removes as one folder ───────────────────────────
j(d, "switch", "alpha")
code, out = j(d, "environments", "remove", "beta", "--yes")
check("removing an environment takes its whole folder", (code, "kept whole" in out), (0, True))
check("and the folder is gone from environments/", (envs / "beta").exists(), False)
box = next((d / ".journal" / "removed").iterdir(), None)
check("archived whole, pins and to-dos together",
      (box is not None, (box / "environment").is_dir() if box else False), (True, True))

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
