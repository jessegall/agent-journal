#!/usr/bin/env python3
"""The docs catalogue: a doc is a folder of parts, cited by pins, rules and to-dos.

    .journal/test_docs.py

Driven through the CLI and the real hook in a throwaway project, the way an agent and a
person use it. The properties that matter: a number is given once and never reused; a
single file is a doc and becomes a folder without breaking what cites it; nothing is
deleted, only struck with a reason; the catalogue, not the docs, is what a session is
handed; a loose markdown file earns a hint, once, never a hold.
"""
import json, os, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"  # no network from the hooks under test
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"  # a pull inside a suite runs no suites

SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import docs, transcript  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


d = Path(tempfile.mkdtemp()) / "proj"
(d / ".claude").mkdir(parents=True)
shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns("runtime", "state.json*", "record.json*",
                                                                   "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
(d / ".journal" / "settings.json").write_text(json.dumps({"context_window": 1000000}))
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
path = tdir / "s1.jsonl"; path.write_text("")
J = str(d / ".journal" / "journal.py")
env = {**os.environ, transcript.SESSION_ENV: "s1"}
root = d / ".journal"


def j(*args, stdin=""):
    p = subprocess.run([J, *args], env=env, input=stdin, capture_output=True, text=True, timeout=60)
    return p.returncode, p.stdout + p.stderr


def fire(event, **extra):
    payload = {"hook_event_name": event, "session_id": "s1", "transcript_path": str(path), **extra}
    p = subprocess.run([str(root / "hook.py")], input=json.dumps(payload), capture_output=True, text=True, timeout=60)
    return p.stdout


# ---------------------------------------------------------------- creating
code, out = j("docs")
check("an empty catalogue says so", (code, "No docs are catalogued" in out), (0, True))
code, out = j("docs", "add", "Reactivity", "--brief", stdin="The graph the proxy records.\n")
check("a doc needs an abstract", (code, "needs an abstract" in out), (1, True))
code, out = j("docs", "add", "Reactivity", "--abstract=The proxy records the dependency graph; a change answers by tier.", "--brief",
              stdin="Ruled today. Every composition composes from its proxy.\n\nOpen question: content hashes on the client?\n")
check("a doc is created as a draft folder with an index", (code, "doc 1: Reactivity" in out, (d / ".journal" / "docs" / "reactivity" / "index.md").is_file()), (0, True, True))
code, out = j("docs", "add", "reactivity", "--abstract=x")
check("a duplicate title is refused", code, 1)
code, out = j("docs", "part", "1", "The three tiers", "--brief", stdin="Unread, leaf, decision.\n")
check("a part is a numbered file in the folder", (code, "doc 1.1" in out, (d / ".journal" / "docs" / "reactivity" / "01-the-three-tiers.md").is_file()), (0, True, True))
code, out = j("docs", "part", "1", "Content hashes", "--brief", stdin="Ids are places; hashes belong to the client.\n")
check("parts number up", "doc 1.2" in out, True)
code, out = j("docs", "part", "1", "Empty")
check("a part needs a body", (code, "needs a body" in out), (1, True))

# ---------------------------------------------------------------- reading
code, out = j("docs")
check("the catalogue lists number, title, status, parts, abstract",
      ("1  Reactivity" in out, "draft · 2 part(s)" in out, "dependency graph" in out), (True, True, True))
code, out = j("docs", "1")
check("reading a doc prints the abstract, the intro and the parts in order",
      ("DOC 1" in out, "ABSTRACT" in out, "Ruled today" in out, "1.1  THE THREE TIERS" in out, "1.2  CONTENT HASHES" in out,
       out.index("1.1  THE THREE TIERS") < out.index("1.2  CONTENT HASHES")), (True, True, True, True, True, True))
code, out = j("docs", "1.2")
check("reading a part prints that part", ("DOC 1.2" in out, "hashes belong" in out, "Unread, leaf" in out), (True, True, False))
code, out = j("docs", "1.9")
check("a missing part says so", (code, "has no part 9" in out), (1, True))
code, out = j("docs", "7")
check("a missing doc says so", (code, "no doc 7" in out), (1, True))

# ---------------------------------------------------------------- striking, replacing, status, supersede
code, out = j("docs", "strike", "1.1", "the tiers moved into the intro")
check("a part is struck to struck/ with the reason",
      (code, not (d / ".journal" / "docs" / "reactivity" / "01-the-three-tiers.md").exists(),
       "the tiers moved" in (d / ".journal" / "docs" / "reactivity" / "struck" / "01-the-three-tiers.md").read_text()), (0, True, True))
code, out = j("docs", "part", "1", "Later part", "--brief", stdin="x\n")
check("a new part never reuses a struck number", "doc 1.3" in out, True)
code, out = j("docs", "replace", "1.2", "--brief", stdin="Hashes, revised.\n")
check("replace keeps the old body under struck/", (code, "Hashes, revised" in (d / ".journal" / "docs" / "reactivity" / "02-content-hashes.md").read_text(),
                                                   (d / ".journal" / "docs" / "reactivity" / "struck" / "02-content-hashes.md").is_file()), (0, True, True))
code, out = j("docs", "final", "1")
check("final sets the status", (code, "is final" in out), (0, True))
j("docs", "add", "Reactivity v2", "--abstract=The revised design.")
code, out = j("docs", "supersede", "1", "by", "2")
check("supersede points both ways", (code, "superseded by doc 2" in out), (0, True))
code, out = j("docs", "1")
check("the old doc says to read the new one", "Read that instead: journal docs 2" in out, True)
code, out = j("docs")
check("the catalogue strikes the superseded one through", "~~Reactivity~~" in out, True)

# ---------------------------------------------------------------- adopting loose files
(d / ".journal" / "docs" / "slots.md").write_text("# A State never owns a component\n\n**Ruled 2026-09-01.** Children are slots.\n\n## Why\n\nBecause.\n")
(d / ".journal" / "docs" / "inventory").mkdir()
(d / ".journal" / "docs" / "inventory" / "widgets.md").write_text("# Widgets\n\nTwenty of them.\n")
(d / ".journal" / "docs" / "inventory" / "scenes.md").write_text("# Scenes\n\nSix.\n")
code, out = j("docs")
check("loose files are named as uncatalogued", "not catalogued: inventory, slots.md" in out, True)
code, out = j("docs", "index")
check("index adopts a file as a doc and a folder as a doc of parts",
      (code, "doc 3: Widgets — folder, 2 part(s)" in out or "doc 3: Scenes — folder, 2 part(s)" in out, "A State never owns a component" in out), (0, True, True))
docs_now = docs._load(root)
slots = next(x for x in docs_now if "State never" in x["title"])
check("an adopted file keeps its path and gets an abstract from its first paragraph",
      (slots["path"].name, "Ruled 2026-09-01. Children are slots." in slots["abstract"], slots["status"]), ("slots.md", True, "final"))
code, out = j("docs", "abstract", str(slots["n"]), "Children are slots; State holds data only.")
check("the abstract can be set", (code, "Children are slots; State" in out), (0, True))
n_slots = slots["n"]
code, out = j("docs", "part", str(n_slots), "The mounted flag", "--brief", stdin="mounted is a slot fact.\n")
check("a single-file doc grows a part by becoming a folder, leaving a pointer",
      (code, (d / ".journal" / "docs" / "slots" / "index.md").is_file(), "pointer:" in (d / ".journal" / "docs" / "slots.md").read_text()), (0, True, True))
code, out = j("docs", str(n_slots))
check("and reads whole through the pointer", ("Children are slots" in out, "mounted is a slot fact" in out), (True, True))
code, out = j("docs")
check("the pointer is not listed as a loose file", "slots.md" in out.split("not catalogued")[-1] if "not catalogued" in out else False, False)

# ---------------------------------------------------------------- citations
code, out = j("remember", "read the slots doc before touching any State", f"--doc={n_slots}")
check("a pin cites a doc", (code, "pinned" in out), (0, True))
code, out = j("remember", "bad ref", "--doc=99")
check("a bad reference is refused", (code, "no doc 99" in out), (1, True))
code, out = j("rule", "components are slots", f"--doc={n_slots}.1")
check("a rule cites a part", (code, "ruled" in out), (0, True))
code, out = j("todo", "convert the last widgets", "--doc=2")
check("a to-do cites a doc", (code, "to-do 1" in out), (0, True))
code, out = j("pins")
check("the pin shows its doc", f"→ doc {n_slots}: Children" in out or f"→ doc {n_slots}: A State" in out, True)
code, out = j("rules")
check("the rule shows its part, and the doc it is part of", f"→ doc {n_slots}.1: " in out and "· The mounted flag" in " ".join(out.split()), True)
code, out = j("todo")
check("the to-do shows its doc", "→ doc 2: Reactivity v2" in out, True)
code, out = j("docs", str(n_slots))
check("the doc lists what cites it", ("CITED BY" in out, "pin 1" in out, "rule 1" in out), (True, True, True))
code, out = j("docs", "2")
check("and the other doc lists its to-do", "to-do 1" in out, True)

# ---------------------------------------------------------------- search
code, out = j("docs", "search", "slots")
check("docs search finds lines across docs and parts, marked", ("DOC LINE(S) MENTION 'slots'" in out, "«slots»" in out), (True, True))
code, out = j("docs", "search", "zzznotthere")
check("an empty docs search points at the transcript", "NO DOC MENTIONS" in out, True)

# ---------------------------------------------------------------- what a session is handed
fire("SessionStart", source="startup")
out = fire("SessionStart", source="startup")
ctx = json.loads(out)["hookSpecificOutput"]["additionalContext"]
check("the start block carries the catalogue, not the docs",
      ("DOCS OF THIS PROJECT" in ctx, "Children are slots; State" in ctx, "mounted is a slot fact" in ctx, "Reactivity v2" in ctx, "  1  Reactivity" in ctx),
      (True, True, False, True, False))
code, out = j()
check("the status page has a docs row", "docs" in out and "catalogued" in out, True)

# ---------------------------------------------------------------- the markdown hint
j("start", "w")
out = fire("PostToolUse", tool_name="Write", tool_input={"file_path": str(d / ".journal" / "docs" / "notes.md")}, tool_response="ok")
check("a loose markdown write earns a hint naming the command", (".journal/docs/notes.md" in out, "docs add" in out, '"decision"' in out), (True, True, False))
out = fire("PostToolUse", tool_name="Write", tool_input={"file_path": str(d / ".journal" / "docs" / "notes.md")}, tool_response="ok")
check("once per file", out.strip(), "")
out = fire("PostToolUse", tool_name="Edit", tool_input={"file_path": str(d / ".journal" / "docs" / "reactivity" / "02-content-hashes.md")}, tool_response="ok")
check("editing a catalogued doc by hand is not hinted", out.strip(), "")
out = fire("PostToolUse", tool_name="Write", tool_input={"file_path": str(d / "README.md")}, tool_response="ok")
check("a README is not hinted", out.strip(), "")
out = fire("PostToolUse", tool_name="Bash", tool_input={"command": "cat > .journal/docs/plan.md <<'EOF'\nx\nEOF"}, tool_response="")
check("a bash redirect into a markdown file is hinted", ".journal/docs/plan.md" in out, True)
out = fire("PostToolUse", tool_name="Bash", tool_input={"command": ".journal/journal.py docs add x --brief < notes.md"}, tool_response="")
check("the journal's own writes are not", out.strip(), "")

# ---------------------------------------------------------------- subagents
out = fire("PreToolUse", agent_id="abc", tool_name="Bash", tool_input={"command": '.journal/journal.py docs add "x" --abstract=y'})
check("a subagent cannot write docs", "from a subagent is refused" in out, True)
out = fire("PreToolUse", agent_id="abc", tool_name="Bash", tool_input={"command": ".journal/journal.py docs 1"})
check("but may read them", out.strip(), "")

# ---------------------------------------------------------------- the write gate knows todo start
out = fire("PreToolUse", tool_name="Bash", tool_input={"command": 'journal end "w" && journal todo start 1 && cat > x.py <<EOF\ny\nEOF'})
check("journal todo start N declares work for the rest of the line", "deny" in out, False)

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
