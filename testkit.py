"""One interpreter per test project, instead of one per check.

THE SUITES SPENT THEIR WHOLE LIFE IMPORTING. Measured on this machine: a bare
`python3 -c pass` is 58ms; `python3 journal.py version` is 480ms. The 422ms difference is
the package's own import — 25 modules, and `worktree.resolve` shelling out to `git
rev-parse` twice before the command is even parsed. There are 148 `subprocess.run` call
sites across the suites, many inside loops, so the whole set cost 60s wall and 220s CPU to
run assertions that are string comparisons.

SO THE INTERPRETER IS PAID FOR ONCE PER PROJECT. A test project already has its own copy of
the package under `<project>/.journal/`, and that copy's `ROOT` is fixed by `__file__` — so
one long-lived process started from it is bound to that project for good, which is exactly
what a session is. This module starts one, keeps it, and speaks a line of JSON to it per
call: argv in, (code, stdout+stderr) out; or a hook payload in, its stdout out.

WHAT IT DOES NOT DO. It does not fake anything. The same `journal.run` and `hook.main` run,
against the same files, in the same order. What is lost is the process boundary, and the
few tests that are ABOUT that boundary — the shebang, the exit status, the record lock under
real concurrent writers, `worktree.resolve` reading a symlinked `__file__` — must keep
spawning, and are worth their cost. `spawn()` is here for them.
"""
from __future__ import annotations

import contextlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

#: The loop the server runs. It imports the project's own copy once, then answers calls.
#: stdout is captured per call rather than per process, because a command's output IS the
#: thing under test and the harness must not interleave two of them.
_SERVER = r'''
import io, json, sys, contextlib
sys.path.insert(0, %r)
import journal, hook, state
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    req = json.loads(line)
    import os as _os
    if req.get("session"):
        _os.environ["CLAUDE_CODE_SESSION_ID"] = req["session"]
    else:
        _os.environ.pop("CLAUDE_CODE_SESSION_ID", None)
    buf = io.StringIO()
    code = 0
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            if req["kind"] == "cli":
                code = journal.run(req["argv"])
            else:
                code = hook.main(json.dumps(req["payload"]))
    except SystemExit as e:
        code = int(e.code or 0)
    except BaseException as e:                      # a crash is a result, not a hang
        code = 99
        buf.write("\n%%s: %%s" %% (type(e).__name__, e))
    sys.__stdout__.write(json.dumps({"code": code, "out": buf.getvalue()}) + "\n")
    sys.__stdout__.flush()
'''


class Project:
    """One test project, and the one interpreter that answers for it."""

    def __init__(self, root: Path):
        self.root = Path(root)
        self.journal = self.root / ".journal"
        self._p = None

    def _server(self):
        if self._p is None or self._p.poll() is not None:
            self._p = subprocess.Popen(
                [sys.executable, "-c", _SERVER % str(self.journal)],
                stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL, text=True, bufsize=1,
                env={**os.environ, "AGENT_JOURNAL_OFFLINE": "1", "AGENT_JOURNAL_IN_TESTS": "1"},
            )
        return self._p

    def _ask(self, req: dict) -> tuple[int, str]:
        p = self._server()
        p.stdin.write(json.dumps(req) + "\n")
        p.stdin.flush()
        line = p.stdout.readline()
        if not line:                                 # the server died: say so, do not hang
            return 99, "the journal server exited"
        got = json.loads(line)
        return got["code"], got["out"]

    def cli(self, *argv: str, session: str = "") -> tuple[int, str]:
        """`journal <argv>`, as a terminal would run it."""
        return self._ask({"kind": "cli", "argv": list(argv), "session": session})

    def hook(self, event: str, **payload) -> tuple[int, str]:
        """One hook event, its JSON on stdin."""
        return self._ask({"kind": "hook", "payload": {"hook_event_name": event, **payload}})

    def close(self):
        if self._p is not None:
            with open(os.devnull, "w"):
                self._p.stdin.close()
            self._p.wait(timeout=10)
            self._p = None


#: The package's own files, HARDLINKED into a fixture rather than copied.
#: `shutil.copytree` of 25 modules per scenario was the other half of the suites' cost, and
#: a copy is not what the test needs — it needs the same code at a DIFFERENT path, so that
#: `ROOT` (which is `Path(__file__).resolve().parent`) points at the fixture's own record.
#: A hardlink gives exactly that: one inode, two paths, and `resolve()` stays in the
#: fixture because a hardlink is not a symlink. Editing a fixture's copy would edit the
#: real file, so nothing here may write to a `.py` under a fixture — and nothing does.
_SKIP = {"runtime", "todo", "docs", "tools", "environments", ".journal", ".git",
         ".claude", "__pycache__"}


def make(project: Path, src: Path, settings: dict | None = None) -> Path:
    """A test project at `project`, with `src`'s package hardlinked into `.journal`."""
    project = Path(project)
    (project / ".claude").mkdir(parents=True, exist_ok=True)
    root = project / ".journal"
    root.mkdir(parents=True, exist_ok=True)
    for f in Path(src).iterdir():
        if f.name in _SKIP or f.name.startswith(("record.json", "state.json")):
            continue
        if f.is_dir():
            shutil.copytree(f, root / f.name, dirs_exist_ok=True)
        else:
            with contextlib.suppress(OSError):
                os.link(f, root / f.name)
            if not (root / f.name).exists():
                shutil.copy2(f, root / f.name)
    (root / "journal.py").chmod(0o755)
    (root / "hook.py").chmod(0o755)
    if settings is not None:
        (root / "settings.json").write_text(json.dumps(settings))
    return root


def hold(out: str) -> tuple[str, str]:
    """(the short label, the text the agent reads) of a Stop's answer — either shape.

    A STOP HOLDS IN TWO FIELDS AND THE SUITES ONLY KNEW ONE. `decision: "block"` carries its
    line in `reason`; `additionalContext` holds just as hard and carries it there, without
    the harness calling it an error. Every suite had its own copy of the first shape, so the
    day the package started using the second, five suites failed for a reason that had
    nothing to do with what they were testing. One reader, here, for all of them.
    """
    if not (out or "").strip():
        return "", ""
    got = json.loads(out)
    if got.get("decision") == "block":
        text = got.get("reason", "")
    else:
        text = (got.get("hookSpecificOutput") or {}).get("additionalContext", "") \
            or got.get("systemMessage", "")
    if not text:
        return "", ""
    head, _, rest = text.partition("\n")
    label = head[len("journal: "):] if head.startswith("journal: ") else head
    # THE OLD SHAPE, STILL READ. A hold that must block is one line with an em dash in it,
    # because `reason` has no room for a second; everything else is a heading and an
    # indented instruction. Both parse to the same pair.
    if "\n" not in text and " — " in label:
        label, _, rest = label.partition(" — ")
    return label.strip(), " ".join(rest.split()) or label.strip()


def spawn(project: Path, *argv: str, **kw) -> subprocess.CompletedProcess:
    """A REAL process, for the handful of tests that are about the process boundary."""
    return subprocess.run([str(Path(project) / ".journal" / "journal.py"), *argv],
                          capture_output=True, text=True, timeout=60, **kw)
