#!/usr/bin/env python3
"""Preparing an environment, and delegating it: a subagent that journals, under the hooks.

    .journal/test_delegate.py

Every edge: `prepare` creates and switches; the pickup page; `--env=` acts on a named
environment without switching and refuses a name that does not exist; `delegate` refuses
a taken environment, moves the session's and its subagents' writes there, and `--off`
undoes it; a delegated subagent is gated, hinted, allowed to write the journal on that
environment only, refused the verbs that move environments, held at its SubagentStop for
open work, and never told the environment is taken; an undelegated subagent stays
outside all of it; a second session finds the delegated environment taken.
"""
import json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

os.environ["AGENT_JOURNAL_OFFLINE"] = "1"
os.environ["AGENT_JOURNAL_IN_TESTS"] = "1"
SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
import state, tracks, transcript  # noqa: E402

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
shutil.copytree(SRC, d / ".journal", ignore=shutil.ignore_patterns(
    "runtime", "state.json*", "record.json*", "todo", "docs", "tools", ".journal", ".git", ".claude", "__pycache__"))
root = d / ".journal"
(root / "settings.json").write_text("{}")
tdir = transcript.project_dir(d); tdir.mkdir(parents=True, exist_ok=True)
J = str(root / "journal.py")
HOOK = str(root / "hook.py")


class S:
    """A session: its transcript, its environment, its subagents."""

    def __init__(self, stem):
        self.stem = stem
        self.path = tdir / f"{stem}.jsonl"; self.path.write_text("")
        self.env = {**os.environ, transcript.SESSION_ENV: stem}
        self.fire("SessionStart", source="startup")

    def fire(self, event, **extra):
        p = subprocess.run([HOOK], input=json.dumps({"hook_event_name": event, "session_id": self.stem,
                           "transcript_path": str(self.path), **extra}), capture_output=True, text=True, timeout=60)
        return p.stdout, p.stderr

    def j(self, *a, stdin=""):
        p = subprocess.run([J, *a], env=self.env, input=stdin, capture_output=True, text=True, timeout=60)
        return p.returncode, p.stdout + p.stderr

    def agent(self, aid):
        return A(self, aid)


class A:
    """A subagent of a session: the parent's session id and transcript in every payload, plus agent_id."""

    def __init__(self, parent, aid):
        self.parent, self.aid = parent, aid
        self.stem = f"agent-{aid}"
        sub = tdir / parent.stem / "subagents"; sub.mkdir(parents=True, exist_ok=True)
        self.path = sub / f"{self.stem}.jsonl"; self.path.write_text("")

    def fire(self, event, **extra):
        p = subprocess.run([HOOK], input=json.dumps({"hook_event_name": event, "session_id": self.parent.stem,
                           "transcript_path": str(self.parent.path), "agent_id": self.aid, **extra}),
                           capture_output=True, text=True, timeout=60)
        return p.stdout, p.stderr

    def tool(self, name, **inp):
        out, _ = self.fire("PreToolUse", tool_name=name, tool_input=inp)
        return (json.loads(out).get("hookSpecificOutput") or {}).get("permissionDecisionReason", "") if out.strip() else ""

    def bash(self, cmd):
        return self.tool("Bash", command=cmd)

    def post(self, name="Read", **inp):
        out, _ = self.fire("PostToolUse", tool_name=name, tool_input=inp, tool_response="x")
        return (json.loads(out).get("hookSpecificOutput") or {}).get("additionalContext", "") if out.strip() else ""

    def stop(self, after=False):
        out, _ = self.fire("SubagentStop", stop_hook_active=after)
        return json.loads(out).get("reason", "") if out.strip() else ""

    def j(self, *a, stdin=""):
        # a subagent's shell carries the PARENT's session id — measured — and nothing else
        p = subprocess.run([J, *a], env=self.parent.env, input=stdin, capture_output=True, text=True, timeout=60)
        return p.returncode, p.stdout + p.stderr

    def say(self, text, tokens=1000):
        with self.path.open("a") as fh:
            fh.write(json.dumps({"type": "user", "origin": {"kind": "human"}, "uuid": "u", "message": {"role": "user", "content": "brief"}}) + "\n")
            fh.write(json.dumps({"type": "assistant", "uuid": f"a{os.urandom(3).hex()}", "message": {
                "role": "assistant", "content": [{"type": "text", "text": text}], "usage": {"input_tokens": tokens}}}) + "\n")


def rec():
    return json.loads((root / "record.json").read_text())


# ---------------------------------------------------------------- prepare
main = S("aaaaaaaa-0000-4000-8000-000000000001")
code, out = main.j("prepare", "wwm-1601")
check("prepare creates the environment, switches this session to it, and prints what preparing means",
      (code, tracks.bound(root, main.stem), "PREPARE" in out, "the source" in out, "journal docs add" in out, "todo" in out, "delegate" in out),
      (0, "wwm-1601", True, True, True, True, True))
check("the project's start environment did not move", rec().get("current", "default"), "default")
code, out = main.j("prepare")
check("prepare wants a name", code, 1)
code, out = main.j("prepare", "wwm-1601")
check("preparing the environment you are on prints the checklist again, no complaint", (code, "PREPARE" in out), (0, True))

main.j("docs", "add", "wwm-1601: delete guard", "--abstract=should deleting an item be refused mid-sale", "--brief", stdin="the issue body\n")
main.j("docs", "part", "1", "Plan", "--brief", stdin="phase A: the guard; phase B: the tests\n")
main.j("pin", "DisposeItem already refuses a pending sale; DeleteItem must match it", "--doc=1")
main.j("todo", "add the guard to DeleteItem", "--brief", "--doc=1.1", stdin="mirror DisposeItem\n")
main.j("todo", "verify and close", "--brief", "--doc=1", stdin="run the suite, close the issue\n")
code, out = main.j("environments", "wwm-1601")
check("the pickup page: read first, what stands, to-dos in order, how to begin",
      (code, "ENVIRONMENT wwm-1601" in out, "delete guard" in out, "DisposeItem already refuses" in out,
       "add the guard to DeleteItem" in out, "verify and close" in out, 'journal switch "wwm-1601"' in out,
       'journal delegate "wwm-1601"' in out, 'journal --env="wwm-1601" todo start 1' in out, "held by session aaaaaaaa" in out),
      (0, True, True, True, True, True, True, True, True, True))
code, out = main.j("environments", "nowhere")
check("a page for an environment that does not exist is refused", (code, "no environment is called" in out), (1, True))

# ---------------------------------------------------------------- --env: act on a named environment without switching
main.j("switch", "default")
check("back on default", tracks.bound(root, main.stem), "default")
code, out = main.j("--env=wwm-1601", "pin", "pinned from default onto 1601")
check("--env= writes onto the named environment", (code, [p["fact"] for p in rec()["tracks"]["wwm-1601"]["pins"]][-1]), (0, "pinned from default onto 1601"))
check("and the session stays bound where it was", tracks.bound(root, main.stem), "default")
code, out = main.j("--env=wwm-1601", "todo")
check("--env= reads the named environment's list", ("add the guard" in out, "verify and close" in out), (True, True))
code, out = main.j("--env=nope", "pins")
check("--env= with a name that does not exist is refused, not created",
      (code, "no environment is called" in out, "nope" in rec()["tracks"]), (1, True, False))
code, out = main.j("--track=wwm-1601", "pins")
check("--track= is the old spelling of --env=", (code, "pinned from default onto 1601" in out), (0, True))

# ---------------------------------------------------------------- an undelegated subagent: outside, as before
main.j("rule", "a rule for every environment")
lone = main.agent("lone1")
check("an undelegated subagent's journal write is refused", "from a subagent is refused" in lone.bash('.journal/journal.py pin "x"'), True)
check("its edits are not gated", lone.tool("Write", file_path=str(d / "f.txt"), content="x"), "")
check("its SubagentStop holds nothing", lone.stop(), "")
check("its first tool call hands it the rules only, and says whose journal it is", "YOU ARE A SUBAGENT. The journal here is the main" in lone.post(), True)

# ---------------------------------------------------------------- delegate
code, out = main.j("delegate", "nowhere")
check("delegating an environment that does not exist is refused", (code, "no environment is called" in out), (1, True))
other = S("bbbbbbbb-0000-4000-8000-000000000002")
other.j("switch", "wwm-1601")
code, out = main.j("delegate", "wwm-1601")
check("delegating an environment another live session holds is refused, naming it", (code, "taken by session bbbbbbbb" in out), (1, True))
other.fire("SessionEnd", reason="exit")
code, out = main.j("delegate", "wwm-1601")
check("delegating a free environment works and says how a subagent is briefed",
      (code, "act on wwm-1601" in out, 'journal environments "wwm-1601"' in out, tracks.delegated(root, main.stem)), (0, True, True, "wwm-1601"))
check("one session id, one environment: delegating binds the session there for the duration", tracks.bound(root, main.stem), "wwm-1601")
code, out = main.j("pin", "filed by the parent while delegating")
check("the parent's own writes land on the delegated environment meanwhile",
      [p["fact"] for p in rec()["tracks"]["wwm-1601"]["pins"]][-1], "filed by the parent while delegating")
code, out = main.j()
check("the status page says the environment is delegated", ("wwm-1601" in out, "(delegated)" in out), (True, True))
code, out = main.j("environments")
check("the listing shows this session on the delegated environment", "wwm-1601" in out and "aaaaaaaa" in out.split("wwm-1601")[1].split("\n")[0], True)

# ---------------------------------------------------------------- a delegated subagent, under the hooks
w = main.agent("w0rk1")
ctx = w.post()
check("its first tool call says it is delegated, which environment, and what the hooks hold it to",
      ("DELEGATED THE ENVIRONMENT `wwm-1601`" in ctx, "work start" in ctx, 'environments "wwm-1601"' in ctx, "[!reply]" in ctx), (True, True, True, True))
check("and it is remembered as acting there", tracks.delegated(root, "agent-w0rk1"), "wwm-1601")
check("its edit with nothing open is gated, like a session's", "Nothing is open" in w.tool("Write", file_path=str(d / "g.txt"), content="x"), True)
check("a read is not", w.tool("Read", file_path=str(d / "g.txt")), "")
check("`journal switch` from it is refused even when delegated", "refused even when delegated" in w.bash('.journal/journal.py switch "elsewhere"'), True)
check("`journal delegate` too", "refused even when delegated" in w.bash('.journal/journal.py delegate "x"'), True)
check("`journal prepare` too", "refused even when delegated" in w.bash('.journal/journal.py prepare "x"'), True)
check("`journal todo start` from it is allowed", w.bash(".journal/journal.py todo start 1"), "")
code, out = w.j("todo", "start", "1")
check("and it opens the to-do on the delegated environment",
      (code, [x["subject"] for x in rec()["tracks"]["wwm-1601"]["work"] if not x.get("ended")]), (0, ["add the guard to DeleteItem"]))
check("with work open its edit passes", w.tool("Write", file_path=str(d / "g.txt"), content="x"), "")
check("`journal pin` from it is allowed", w.bash('.journal/journal.py pin "found by the subagent"'), "")
code, out = w.j("pin", "found by the subagent", "--doc=1")
check("and the pin lands on the delegated environment, citing the doc",
      (code, rec()["tracks"]["wwm-1601"]["pins"][-1]["fact"], rec()["tracks"]["wwm-1601"]["pins"][-1].get("doc")), (0, "found by the subagent", "1"))
check("the parent's own environment got nothing", [p["fact"] for p in rec()["tracks"].get("default", {}).get("pins", [])], [])
w.say("[!reply] working on it")
check("its stop with work open is held", "still open" in w.stop(), True)
code, out = w.j("work", "end", "add the guard to DeleteItem")
check("`journal work end` from it closes the to-do", (code, [t["n"] for t in __import__("todo").open_items(root, "wwm-1601")]), (0, [2]))
w.say("[!reply] done")
check("with nothing open its stop passes", w.stop(), "")
check("a delegated subagent is never told the environment is taken", "IS TAKEN" in w.tool("Write", file_path=str(d / "h.txt"), content="x"), False)
# hints reach it
outside = Path(tempfile.mkdtemp()); (outside / "spec.pdf").write_bytes(b"%PDF")
w.post(name="Read", file_path=str(outside / "spec.pdf"))
check("the attach hint reaches a delegated subagent", "docs attach" in w.post(name="Read", file_path=str(outside / "spec.pdf")), True)
check("docs attach from it is allowed", w.bash(f'.journal/journal.py docs attach 1 "{outside / "spec.pdf"}" "the spec"'), "")
# the rules ladder still climbs for it
w.say("[!reply] deep in", tokens=520000)
check("the rules come back at its own marks", "RULES" in w.post().upper() or "rule" in w.post().lower(), True)

# ---------------------------------------------------------------- a second subagent, and a second session
w2 = main.agent("w0rk2")
check("a second subagent of the same session is delegated too", "DELEGATED THE ENVIRONMENT" in w2.post(), True)
third = S("cccccccc-0000-4000-8000-000000000003")
third.j("switch", "wwm-1601")
code, out = third.j("switch", "wwm-1601")
check("another session cannot land on the delegated environment", "taken by session aaaaaaaa" in out, True)
third.fire("SessionEnd", reason="exit")

# ---------------------------------------------------------------- --off
code, out = main.j("delegate", "--off")
check("--off ends it and says where the session is", (code, "back on default" in out, tracks.delegated(root, main.stem)), (0, True, None))
check("and binds it back where it was", tracks.bound(root, main.stem), "default")
check("the subagent is registered nowhere again", tracks.delegated(root, "agent-w0rk1"), None)
check("the subagent's writes are refused again", "from a subagent is refused" in w.bash('.journal/journal.py pin "late"'), True)
check("and its stop holds nothing", w.stop(), "")
code, out = main.j("pin", "back home")
check("the parent's writes are back on its own environment", [p["fact"] for p in rec()["tracks"]["default"]["pins"]][-1], "back home")
code, out = main.j("delegate", "--off")
check("--off twice says nothing was delegated", code, 1)

# ---------------------------------------------------------------- handoff: two prompts, by agents
h = S("eeeeeeee-0000-4000-8000-000000000005")
code, out = h.j("handoff", "wwm-1700", "https://example.test/issues/1700 — the delete guard, second half")
check("handoff creates the environment, delegates it, and prints the hand-off agent's prompt from the shipped template",
      (code, "wwm-1700" in tracks._all(root), tracks.delegated(root, h.stem), "Dispatch ONE subagent" in out,
       "HAND-OFF AGENT" in out, "https://example.test/issues/1700" in out, "READY" in out, "handoff.default.md" in out),
      (0, True, "wwm-1700", True, True, True, True, True))
check("the runner's section is not in the hand-off prompt", "You are the RUNNER" in out, False)
check("the hand-off agent is given no worktree: it writes only the journal, which is shared anyway",
      ('isolation: "worktree"' in out, "YOU ARE IN YOUR OWN WORKTREE" in out), (False, False))
ha = h.agent("hand0ff1")
check("the hand-off agent may write the environment (docs, pins, to-dos)", ha.bash('.journal/journal.py docs add "wwm-1700: x" --abstract="y" --brief'), "")
check("but may not hand off in turn", "refused even when delegated" in ha.bash('.journal/journal.py handoff "other" "x"'), True)
ha.j("docs", "add", "wwm-1700: the delete guard, second half", "--abstract=what the runner must know", "--brief", stdin="the source\n")
ha.j("todo", "the first unit of work", "--brief", "--doc=2", stdin="start here\n")
code, out = h.j("handoff", "wwm-1700", "--run")
check("--run prints the runner's prompt with the page inside it",
      (code, "You are the RUNNER" in out, "the first unit of work" in out, "what the runner must know" in out, "todo start" in out), (0, True, True, True, True))
flat = " ".join(out.split())
check("the run is dispatched into its own worktree, and the journal stays shared",
      ('isolation: "worktree"' in flat, "`.journal` is a symlink to this one" in flat), (True, True))
check("the branch is the session's to settle: offer, or merge when the user already asked",
      ("OFFER the merge" in flat, "add a line granting it" in flat, "do not merge on your own" in flat),
      (True, True, True))
check("the runner is told it is in a worktree, and that the journal is not its own",
      ("YOU ARE IN YOUR OWN WORKTREE" in flat, "the journal is NOT" in flat), (True, True))
check("it is told to commit as it goes", "COMMIT AS YOU GO" in flat, True)
check("it may not merge unless the prompt granted it",
      "do not merge, rebase, push or touch another branch UNLESS THIS PROMPT TOLD YOU TO" in flat, True)
check("and it reports the branch so the merge can be offered",
      "git branch --show-current" in flat, True)
(root / "handoff.md").write_text("# handoff agent\n\nOUR OWN WAY for {name}: {source}\n\n# runner agent\n\nRUN {name} OUR WAY\n\n{page}\n")
code, out = h.j("handoff", "wwm-1700", "the source again")
check("a project's own handoff.md wins over the shipped template", (code, "OUR OWN WAY for wwm-1700: the source again" in out, ".journal/handoff.md" in out), (0, True, True))
code, out = h.j("handoff", "wwm-1700", "--run")
check("for the runner too", ("RUN wwm-1700 OUR WAY" in out, "ENVIRONMENT wwm-1700" in out), (True, True))
(root / "handoff.md").write_text("# nothing here\n")
code, out = h.j("handoff", "wwm-1700", "x")
check("a template without the section says so", (code, "has no `# handoff agent` section" in out), (1, True))
(root / "handoff.md").unlink()
code, out = h.j("handoff", "--off")
check("--off ends the delegation", (code, tracks.delegated(root, h.stem)), (0, None))
code, out = h.j("handoff")
check("handoff wants a name", code, 1)
import handoff as handoff_mod  # noqa: E402
check("the template module: sections are found by their heading", handoff_mod.section("# a\n\nA body\n\n# b\n\nB body\n", "b"), "B body")
check("and a missing one is empty", handoff_mod.section("# a\n\nA body\n", "b"), "")

# ---------------------------------------------------------------- what the critics found
c = S("99999999-0000-4000-8000-000000000007")
c.j("switch", "wwm-1601")
c.j("pin", "first"); c.j("pin", "second"); c.j("strike", "1", "wrong")
code, out = c.j("environments", "wwm-1601")
allp = rec()["tracks"]["wwm-1601"]["pins"]
idx = max(i for i, p in enumerate(allp, 1) if p["fact"] == "second")
check("the page numbers pins as `journal pins` does — the full list, struck ones skipped",
      (f"{idx:>3}  second" in out, f"{idx - 1:>3}  second" in out), (True, False))
c.j("todo", "an asked one"); n_ask = max(t["n"] for t in __import__("todo").open_items(root, "wwm-1601"))
c.j("todo", "ask", str(n_ask), "which colour?")
code, out = c.j("todo", "start", str(n_ask))
check("a session may start a to-do that waits on the user — the user answered in the conversation", code, 0)
c.j("work", "end", "an asked one")   # ending the work closes the to-do, by design
c.j("todo", "another asked one"); n_ask = max(t["n"] for t in __import__("todo").open_items(root, "wwm-1601"))
c.j("todo", "ask", str(n_ask), "which size?")
c.j("switch", "default"); c.j("handoff", "wwm-1601", "src")
code, out = c.j("todo", "start", str(n_ask))
check("a delegated actor may not: it cannot reach the user, and the next ready one is named", (code, "waits on the user" in out), (1, True))
c.j("handoff", "--off"); c.j("switch", "wwm-1601")
c.j("todo", "a startable one"); n_ok = max(t["n"] for t in __import__("todo").open_items(root, "wwm-1601"))
c.j("todo", "start", str(n_ok))
code, out = c.j("todo", "ask", str(n_ok), "and this?")
check("`todo ask` closes the work `todo start` opened", (code, "closed the work" in out, [w["subject"] for w in __import__("work").open_work(root)]), (0, True, []))
c.j("todo", "answer", str(n_ask), "blue"); c.j("todo", "answer", str(n_ok), "yes")
c.j("switch", "default")
code, out = c.j("handoff", "wwm-1601", "src")
code, out = c.j("handoff", "other-one", "src")
check("a second hand-off while delegating another is refused, naming it", (code, "delegating `wwm-1601`" in out), (1, True))
code, out = c.j("--env=wwm-1601", "environments", "wwm-1601")
check("the page a delegating session prints carries no commands it may not run", "journal switch" in out, False)
code, out = c.j("environments", "wwm-1601")
check("and says the environment is delegated, not held by a stranger", "delegated by session 99999999" in out, True)
code, out = c.j("handoff", "--off")
check("--off says what is still open or waiting on the environment", (code, "to-do(s) waiting" in out), (0, True))
empty = S("88888888-0000-4000-8000-000000000008")
empty.j("handoff", "blank-one", "src")
code, out = empty.j("handoff", "blank-one", "--run")
check("--run refuses an environment with nothing ready", (code, "nothing on `blank-one` is ready" in out), (1, True))
empty.j("handoff", "--off")
# a session that died mid-run is freed from a terminal
dead = S("77777777-0000-4000-8000-000000000009")
dead.j("handoff", "dead-run", "src")
p = subprocess.run([J, "handoff", "--off", "--session=77777777"], env={k: v for k, v in os.environ.items() if k != transcript.SESSION_ENV},
                   capture_output=True, text=True, timeout=60)
check("`handoff --off --session=<id>` from a terminal frees a dead session's delegation", (p.returncode, tracks.delegated(root, dead.stem)), (0, None))
# a delegated subagent's own open work holds its stop
main.j("delegate", "wwm-1601")
ww = main.agent("w0rk9"); ww.post()
ww.j("todo", "another unit"); n_w = max(t["n"] for t in __import__("todo").open_items(root, "wwm-1601"))
ww.j("todo", "start", str(n_w)); ww.say("[!reply] on it")
check("a delegated subagent's stop is held for the work it opened itself", "still open" in ww.stop(), True)
ww.j("work", "end", "another unit")
main.j("delegate", "--off")
check("--off unregisters every subagent on the environment", tracks.delegated(root, "agent-w0rk9"), None)
# an unregistered session may start a hand-off: it is what registers it
holder = S("66666666-0000-4000-8000-00000000000a")
late = S("55555555-0000-4000-8000-00000000000b")
check("a session on a taken environment is registered nowhere", tracks.bound(root, late.stem), None)
check("but may run `journal handoff`, which registers it", late.j("handoff", "late-one", "src")[0], 0)
check("and is registered on the new environment", tracks.bound(root, late.stem), "late-one")
late.j("handoff", "--off")
main.j("pin", "provenance check")
main.j("delegate", "wwm-1601"); main.j("pin", "written under delegation"); main.j("delegate", "--off")
code, out = main.j("--env=wwm-1601", "pins")
check("a pin written while delegating says so, for whoever reads around it later",
      rec()["tracks"]["wwm-1601"]["pins"][-1].get("via"), "delegation")

# ---------------------------------------------------------------- names are slugs, prompts are paragraphs
n = S("ffffffff-0000-4000-8000-000000000006")
code, out = n.j("switch", "Real Time  Nudges!")
check("an environment's name becomes a slug on the way in", (code, tracks.bound(root, n.stem), "real-time-nudges" in tracks._all(root)), (0, "real-time-nudges", True))
code, out = n.j("--env=Real Time Nudges!", "pins")
check("--env= takes the unslugged spelling too", code, 0)
n.j("todo", "a chore on it")
check("the to-do folder is the slug", (root / "todo" / "real-time-nudges").is_dir(), True)
old = json.loads((root / "record.json").read_text())
old["tracks"]["Old Name With Spaces"] = {"pins": [{"fact": "an old pin", "at": "x", "struck": None}], "work": [], "at": "x"}
(root / "record.json").write_text(json.dumps(old))
(root / "todo" / "Old Name With Spaces").mkdir(parents=True)
code, out = n.j("environments")
check("an older record's names are migrated to slugs on first read, folders too",
      ("old-name-with-spaces" in tracks._all(root), "Old Name With Spaces" in tracks._all(root), (root / "todo" / "old-name-with-spaces").is_dir()), (True, False, True))
code, out = n.j("handoff", "real-time-nudges", "--run")
joined = " ".join(out.split())
check("the runner's prompt names the tags, the brief command and the forbidden verbs",
      ("[!reply]" in out, "todo <n>" in out, "`handoff`" in out), (True, True, True))
check("the runner's prompt is paragraphs: no line break inside a sentence",
      ("The session that dispatched you has delegated" in out.replace("\n", " ") and all(len(l) <= 88 for l in out.splitlines())), True)
check("the page inside the runner's prompt carries no switch or delegate commands", ("journal switch" in out, "journal delegate" in out), (False, False))
n.j("handoff", "--off")

# ---------------------------------------------------------------- the rule off
(root / "settings.json").write_text(json.dumps({"one_session_per_environment": False}))
fourth = S("dddddddd-0000-4000-8000-000000000004"); fourth.j("switch", "wwm-1601")
code, out = main.j("delegate", "wwm-1601")
check("with one_session_per_environment off, a held environment can still be delegated", code, 0)
main.j("delegate", "--off")

print(f"\n{ok} passed, {fail} failed")
sys.exit(1 if fail else 0)
