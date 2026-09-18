from __future__ import annotations

import atexit
import contextlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
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
    if req.get("stdin") is not None:
        sys.stdin = io.StringIO(req.get("stdin") or "")
    buf, err = io.StringIO(), io.StringIO()
    code = 0
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(err):
            if req["kind"] == "cli":
                code = journal.run(req["argv"])
            else:
                code = hook.main(json.dumps(req["payload"]))
    except SystemExit as e:
        code = int(e.code or 0)
    except BaseException as e:                      # a crash is a result, not a hang
        code = 99
        err.write("\n%%s: %%s" %% (type(e).__name__, e))
    sys.__stdout__.write(json.dumps({"code": code, "out": buf.getvalue(),
                                     "err": err.getvalue()}) + "\n")
    sys.__stdout__.flush()
'''


class Project:

    def __init__(self, root: Path, bind: bool = True):
        self.err = ""            # the last call's stderr, for the tests that read it
        self.root = Path(root)
        self.journal = self.root / ".journal"
        self._p = None
        # A SESSION THAT HAS NOT CHOSEN AN ENVIRONMENT IS REFUSED, reads included — there is no
        # default one. A real session chooses with `switch`; a suite that is not ABOUT choosing
        # would otherwise have to say so in every fixture, so the harness stands in for it. The
        # suites that test the refusal itself pass bind=False.
        self._bind = bind

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
            self.err = "the journal server exited"
            return 99, self.err
        got = json.loads(line)
        self.err = got.get("err", "")
        return got["code"], got["out"]

    def cli(self, *argv: str, session: str = "", stdin: str = "") -> tuple[int, str]:
        if session and self._bind:
            self._choose(session)
        code, out = self._ask({"kind": "cli", "argv": list(argv), "session": session, "stdin": stdin})
        return code, out + self.err

    def _choose(self, session: str) -> None:
        import tracks
        if not tracks.bound(self.journal, session):
            tracks.bind(self.journal, session, tracks.start(self.journal))

    def hook(self, event: str, **payload) -> tuple[int, str]:
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
_SKIP = {"runtime", "todo", "docs", "tools", "environments", ".journal", ".git", ".idea",
         ".claude", "__pycache__"}


#: EVERY TEMPORARY FOLDER A TEST MAKES LIVES IN ONE SCRATCH FOLDER FOR ITS PROCESS, removed when it
#: exits. Cleaning up only what `make` built was not enough: most suites also call
#: `tempfile.mkdtemp()` directly, for a package copy, a bare record, a transcript, and one full run
#: still left 73 folders behind. Pointing `tempfile.tempdir` here catches all of them. A process whose
#: folders must outlive it (a child that builds a project for its parent) sets AGENT_JOURNAL_KEEP_TMP=1.
if os.environ.get("AGENT_JOURNAL_KEEP_TMP") != "1":
    _SCRATCH = tempfile.mkdtemp(prefix="agent-journal-tests-")
    tempfile.tempdir = _SCRATCH
    # THE HOOKS AND THE CLI A TEST STARTS MUST SEE THE SAME FOLDERS. They do not import this module, so the
    # scratch folder reaches them through the environment; transcripts are looked for where the test wrote them.
    os.environ["TMPDIR"] = _SCRATCH
    os.environ["AGENT_JOURNAL_PROJECTS"] = str(Path(_SCRATCH) / "agent-journal-test-projects")
    if "transcript" in sys.modules:
        sys.modules["transcript"].PROJECTS = Path(os.environ["AGENT_JOURNAL_PROJECTS"])
    atexit.register(shutil.rmtree, _SCRATCH, True)

#: the temporary folders this process made projects in, removed when it exits
_MADE: set[str] = set()


def _remove_made() -> None:
    for d in _MADE:
        shutil.rmtree(d, ignore_errors=True)


def _clean_up_later(project: Path) -> None:
    holder = project.resolve().parent
    if holder.name.startswith("tmp") and holder.parent == Path(tempfile.gettempdir()).resolve():
        if not _MADE:
            atexit.register(_remove_made)
        _MADE.add(str(holder))


def make(project: Path, src: Path, settings: dict | None = None, cleanup: bool = True) -> Path:
    project = Path(project)
    if cleanup:
        _clean_up_later(project)
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


def flat(text: str) -> str:
    return " ".join((text or "").split())


def denied(out: str) -> str:
    if not (out or "").strip():
        return ""
    try:
        got = json.loads(out)
    except ValueError:
        return flat(out)
    spec = got.get("hookSpecificOutput") or {}
    if spec.get("permissionDecision") != "deny":
        return ""
    return flat(spec.get("permissionDecisionReason", ""))


def hold(out: str) -> tuple[str, str]:
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
    return subprocess.run([str(Path(project) / ".journal" / "journal.py"), *argv],
                          capture_output=True, text=True, timeout=60, **kw)
