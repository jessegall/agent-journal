#!/usr/bin/env python3
"""install — wire the journal into a project that has just downloaded it.

    .journal/install.py           wire the hooks, make things executable
    .journal/install.py --alias   also put a `journal` command on your PATH (every shell)
    .journal/install.py --check   say what would change, write nothing
    .journal/install.py --from <path or git url>   pull that package in first (tests run before anything lands)

WHAT THIS IS CAREFUL ABOUT, and why each one is a real way to lose somebody's work:

MERGE, NEVER OVERWRITE. `.claude/settings.json` is the user's file and this is a guest in
it. There may be other hooks in there, on these very events, that matter more than this
one. So the file is read, the journal's entries are added to whatever is already there, and
everything else is passed through untouched. A tool that writes its own config over yours
is a tool you cannot adopt incrementally.

IDEMPOTENT. Running it twice must not wire the hook twice — a duplicated Stop hook fires
twice per stop, holds twice, and reads like the check is broken rather than like the
install is. So an entry already pointing at `hook.py` counts as done.

IT REFUSES TO GUESS ABOUT MALFORMED JSON. If `settings.json` does not parse, this stops and
says so rather than starting from `{}`. Starting fresh would silently delete every hook the
user had, and the failure would look like an install that worked.

--from PULLS THE PACKAGE, NEVER THE DATA. The code, the tests and the skill come across;
the record, the settings and the runtime files are this project's and stay. A pull is a
copy: the package is tested where it is developed, not in every consumer. `--test` runs
the pulled copy's suites first, for the one time you want that. Until this existed every update to a consumer was an rsync by hand, and
"the consumer has the latest" was a belief.

AND IT DOES NOT CLAIM SUCCESS. The last thing it does is run `verify`, which reports WIRED
and FIRED as two separate facts. Installing can only ever prove the first one. The tool this
replaces sat wired and silent for seventeen hours, so `install` finishing is deliberately
not the same as the journal being in force.
"""
from __future__ import annotations

import filecmp
import json
import os
import shutil
import stat
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent
EVENTS = ("Stop", "SubagentStop", "SessionStart", "SessionEnd", "PostToolUse", "PreToolUse", "UserPromptSubmit")
#: What goes in settings.json. `$CLAUDE_PROJECT_DIR` is quoted because a path with a space
#: in it otherwise splits into two arguments and the hook simply never runs.
COMMAND = '"$CLAUDE_PROJECT_DIR"/.journal/hook.py'
EXECUTABLE = ("hook.py", "journal.py", "install.py", "test_tracks.py", "test_gate.py",
              "test_state.py", "test_auto.py", "test_docs.py", "test_tools.py", "test_worktree.py", "test_queue.py", "test_bind.py", "test_delegate.py", "test_unbound.py")

#: THE SKILL IS PART OF THE PACKAGE, and it has to be installed rather than committed.
#: It teaches the reasoning the injected block has no room for, so it belongs beside the
#: code that enforces those rules — but it has to LAND in `.claude/skills/`, which the
#: harness owns and which several projects gitignore. A skill that only exists where it was
#: first written is one that silently goes missing on the next clone, and nothing about a
#: missing skill looks broken: the agent simply never learns why any of this is here.
SKILL_SRC = "skill"
SKILL_DST = ".claude/skills/journal"

#: What belongs to THIS project and never comes across on a pull.
DATA = ("record.json", "record.json.lock", "settings.json", "state.json", "state.json.retired",
        "runtime", "todo", "docs", "tools", "handoff.md", ".journal", "__pycache__")


def _package_files(root: Path) -> list[Path]:
    """Every file of the package under `root`, relative — code, tests, skill, gitignore."""
    out = []
    for f in root.rglob("*"):
        rel = f.relative_to(root)
        # a clone's .git is not the package: copying it once put a nested repository
        # into a consumer's .journal
        if not f.is_file() or rel.parts[0] in DATA or rel.parts[0] == ".git" or f.suffix in (".tmp", ".pyc"):
            continue
        out.append(rel)
    return sorted(out)


def pull(src: Path, check: bool) -> list[str]:
    """Bring another checkout's package here. Tests first, in staging; then the files."""
    src = src.resolve()
    # a repository whose ROOT is the package also holds its own .journal/ instance inside;
    # the root is the source, the instance is that project's data
    if src.name != ".journal" and not (src / "hook.py").is_file() and (src / ".journal").is_dir():
        src = src / ".journal"
    if not (src / "hook.py").is_file() or not (src / "journal.py").is_file():
        raise SystemExit(f"  ! {src} is not a journal package (no hook.py / journal.py)")
    if src == ROOT:
        raise SystemExit("  ! --from names this very checkout; nothing to pull")

    stage = Path(tempfile.mkdtemp()) / ".journal"
    shutil.copytree(src, stage, ignore=shutil.ignore_patterns(*DATA, "*.tmp", "*.pyc"))
    out = [f"  · pulling from {src}"]
    # A PULL INSIDE A SUITE RUNS NO SUITES. The suites test `upgrade`, `upgrade` pulls,
    # and a pull runs the suites — which test `upgrade`. Measured as a test that never
    # ended. The environment marks a run that is already a test, and that run copies
    # without testing; the outer run tested already.
    # NO SUITES ON A PULL. A pull is a copy; the package is tested where it is developed
    # and before it is published. Running the suites in every consumer cost minutes per
    # upgrade for nothing, and the user was right to be angry about it. `--test` runs them.
    inner = os.environ.get("AGENT_JOURNAL_IN_TESTS") or not os.environ.get("AGENT_JOURNAL_TEST_PULL")
    for t in ([] if inner else sorted(stage.glob("test_*.py"))):
        p = subprocess.run([sys.executable, str(t)], capture_output=True, text=True,
                           env={**os.environ, "AGENT_JOURNAL_IN_TESTS": "1"})
        last = (p.stdout.strip().splitlines() or ["(no output)"])[-1]
        out.append(f"  {'=' if p.returncode == 0 else '!'} {t.name}: {last}")
        if p.returncode != 0:
            raise SystemExit("\n".join(out) + "\n  ! the pulled package fails its own tests "
                             "— nothing was copied. Fix it at the source first.")

    theirs = _package_files(stage)
    mine = set(_package_files(ROOT))
    changed = [rel for rel in theirs
               if not (ROOT / rel).is_file() or not filecmp.cmp(stage / rel, ROOT / rel, shallow=False)]
    gone = sorted(mine - set(theirs))
    for rel in changed:
        if not check:
            (ROOT / rel).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(stage / rel, ROOT / rel)
        out.append(f"  + {rel}" + (" (would update)" if check else ""))
    for rel in gone:
        # PACKAGE OUTPUT ONLY. Anything under DATA never reaches this list, so what is
        # removed is code or skill the source no longer ships — and it is said, by name.
        if not check:
            (ROOT / rel).unlink()
        out.append(f"  - {rel} (no longer in the package)")
    if not changed and not gone:
        out.append("  = already at the source's version")
    shutil.rmtree(stage.parent, ignore_errors=True)
    return out


#: THE `journal` COMMAND IS A SCRIPT ON THE PATH, NOT A SHELL ALIAS. An alias lives in one
#: shell's rc file — zsh's, or bash's — and a colleague on fish, or in an editor's terminal
#: that sources nothing, has no `journal`. A script in ~/.local/bin works in every shell
#: that has that directory on its PATH, which is most; when it is not, install says the
#: one line to add. It resolves the project from wherever it is run, so `journal` works
#: from a subdirectory too.
BIN_DIR = Path.home() / ".local" / "bin"
LAUNCHER = """#!/bin/sh
# journal — installed by agent-journal. Runs the journal of the project you are in:
# the nearest directory, from here upward, that holds .journal/. No git required.
dir="$(pwd)"
while [ "$dir" != "/" ]; do
  if [ -f "$dir/.journal/journal.py" ]; then
    exec python3 "$dir/.journal/journal.py" "$@"
  fi
  dir="$(dirname "$dir")"
done
echo "no .journal/ here or above — install agent-journal in this project first" >&2
exit 1
"""


def _settings_path() -> Path:
    return PROJECT / ".claude" / "settings.json"


def wire(check: bool) -> list[str]:
    """Add the journal's hooks to `.claude/settings.json`, keeping everything else."""
    f = _settings_path()
    data: dict = {}
    if f.is_file():
        try:
            data = json.loads(f.read_text() or "{}")
        except ValueError as e:
            # STOP. See the module docstring: an unreadable config is not an empty one,
            # and treating it as one deletes hooks the user is relying on.
            raise SystemExit(
                f"  ! {f} does not parse as JSON: {e}\n"
                "    Fix it by hand — starting from scratch here would delete whatever "
                "else you have wired."
            )
    if not isinstance(data.get("hooks"), dict):
        data["hooks"] = {} if "hooks" not in data else data["hooks"]
    if not isinstance(data["hooks"], dict):
        raise SystemExit(f"  ! {f}: `hooks` is not an object, refusing to touch it")

    done: list[str] = []
    for ev in EVENTS:
        blocks = data["hooks"].setdefault(ev, [])
        if not isinstance(blocks, list):
            raise SystemExit(f"  ! {f}: hooks.{ev} is not a list, refusing to touch it")
        already = any(
            "hook.py" in str(h.get("command", ""))
            for b in blocks
            if isinstance(b, dict)
            for h in (b.get("hooks") or [])
            if isinstance(h, dict)
        )
        if already:
            done.append(f"  = {ev} already wired")
            continue
        blocks.append({"hooks": [{"type": "command", "command": COMMAND}]})
        done.append(f"  + {ev} wired")

    if not check and any(d.startswith("  +") for d in done):
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps(data, indent=2) + "\n")
    return done


def executable(check: bool) -> list[str]:
    """A hook that is not executable fails silently — the harness just gets nothing."""
    out = []
    for name in EXECUTABLE:
        p = ROOT / name
        if not p.is_file():
            out.append(f"  ! {name} is missing")
            continue
        if os.access(p, os.X_OK):
            out.append(f"  = {name} already executable")
            continue
        if not check:
            p.chmod(p.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
        out.append(f"  + {name} made executable")
    return out


# `baseline()` LIVED HERE. It drew a line under pre-journal history by writing a line
# number into project-wide state — for a transcript it guessed by mtime, to protect a
# session it assumed would fire SessionStart before its next Stop. Hooks are picked up
# live, so that session fires a Stop first, and with two terminals open the guess was the
# other one. The hook now writes a `floor` into the transcript's own runtime file the first
# time any event sees it, which covers install, resume, fork and clear alike. Install
# writes no runtime state at all, so it can no longer forge the evidence `verify` reads.


def skill(check: bool) -> list[str]:
    """Copy the packaged skill folder into place, and keep it current on every re-run.

    IT OVERWRITES, DELIBERATELY, and only the files that differ. The installed copy is
    package output, not a place to keep notes: an edited copy would drift away from the
    rules the hooks actually enforce, and a skill that describes a tool inaccurately is
    worse than no skill, because it is believed. Anything worth changing belongs in
    `skill/`, where the next install carries it everywhere.

    THE WHOLE FOLDER, not one file. The skill has a body and references it points at;
    a copy that carried SKILL.md alone would leave every one of those pointers dangling in
    the installed copy, silently. Files the package no longer ships are removed by name.
    """
    src = ROOT / SKILL_SRC
    if not (src / "SKILL.md").is_file():
        return [f"  ! {SKILL_SRC}/SKILL.md is missing — no skill to install"]
    dst = PROJECT / SKILL_DST
    out = []
    theirs = sorted(f.relative_to(src) for f in src.rglob("*") if f.is_file())
    for rel in theirs:
        want = (src / rel).read_bytes()
        have = (dst / rel).read_bytes() if (dst / rel).is_file() else None
        if have == want:
            continue
        if not check:
            (dst / rel).parent.mkdir(parents=True, exist_ok=True)
            (dst / rel).write_bytes(want)
        out.append(f"  + skill {'updated' if have is not None else 'installed'}: {SKILL_DST}/{rel}")
    if dst.is_dir():
        for f in sorted(dst.rglob("*")):
            if f.is_file() and f.relative_to(dst) not in theirs:
                if not check:
                    f.unlink()
                out.append(f"  - {SKILL_DST}/{f.relative_to(dst)} (no longer in the skill)")
    return out or ["  = skill already current"]


OLD_ALIAS_MARK = "# journal — added by .journal/install.py"


def _retire_rc_alias(check: bool) -> list[str]:
    """Remove the alias 1.3.x wrote into the shell rc; name any other `journal` alias.

    A SHELL ALIAS BEATS THE PATH, so the old alias shadowed the new launcher and `journal`
    stayed broken after an upgrade that printed "Already installed." — reported from a
    workspace whose .journal sits above several git repos, where `git rev-parse` in the
    alias could never find it. The lines this installer wrote carry its own marker and are
    removed; a `journal` alias somebody else wrote is only pointed at.
    """
    out = []
    for name in (".zshrc", ".bashrc", ".bash_profile", ".profile"):
        rc = Path.home() / name
        if not rc.is_file():
            continue
        lines = rc.read_text().splitlines(keepends=True)
        keep, removed, foreign = [], 0, []
        skip_next = False
        for line in lines:
            if line.strip() == OLD_ALIAS_MARK:
                skip_next = True
                removed += 1
                continue
            if skip_next and line.lstrip().startswith("alias journal="):
                skip_next = False
                removed += 1
                continue
            skip_next = False
            if line.lstrip().startswith("alias journal=") and "journal.py" in line:
                foreign.append(line.strip())
            keep.append(line)
        if removed:
            if not check:
                rc.write_text("".join(keep))
            out.append(f"  - the old journal alias removed from ~/{name} — open a new terminal")
        for f in foreign:
            out.append(f"  ! ~/{name} has an alias that shadows the journal command; delete this line:\n      {f}")
    return out


def alias(check: bool) -> list[str]:
    """Put `journal` on the PATH as a script, for every shell."""
    dst = BIN_DIR / "journal"
    out = _retire_rc_alias(check)
    if dst.is_file() and dst.read_text() == LAUNCHER and os.access(dst, os.X_OK):
        out.append(f"  = journal command already in {BIN_DIR}")
    else:
        if not check:
            BIN_DIR.mkdir(parents=True, exist_ok=True)
            dst.write_text(LAUNCHER)
            dst.chmod(dst.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
        out.append(f"  + journal command installed in {BIN_DIR}")
    on_path = str(BIN_DIR) in os.environ.get("PATH", "").split(os.pathsep)
    if not on_path:
        shell = Path(os.environ.get("SHELL", "")).name
        line = {"fish": f"fish_add_path {BIN_DIR}",
                "zsh": f'echo \'export PATH="$HOME/.local/bin:$PATH"\' >> ~/.zshrc',
                "bash": f'echo \'export PATH="$HOME/.local/bin:$PATH"\' >> ~/.bashrc'}.get(
            shell, f"add {BIN_DIR} to your PATH")
        out.append(f"  ! {BIN_DIR} is not on your PATH — once, in your shell:\n      {line}\n"
                   "    then open a new terminal. Until then: .journal/journal.py <command>")
    return out


def main(argv: list[str]) -> int:
    if any(a in ("-h", "--help", "help") for a in argv):
        print(__doc__)
        return 0
    check = "--check" in argv
    if "--test" in argv:
        os.environ["AGENT_JOURNAL_TEST_PULL"] = "1"
    src = None
    for i, a in enumerate(argv):
        if a == "--from" and i + 1 < len(argv):
            src = argv[i + 1]
        elif a.startswith("--from="):
            src = a.split("=", 1)[1]
    lines = []
    if src is not None:
        import re, subprocess, tempfile
        # judged as the string typed: Path() folds `https://` into `https:/`
        if re.match(r"^(https?://|git@|ssh://)", src) or src.endswith(".git"):
            tmp = Path(tempfile.mkdtemp()) / "pkg"
            p = subprocess.run(["git", "clone", "--quiet", "--depth", "1", src, str(tmp)],
                               capture_output=True, text=True)
            if p.returncode != 0:
                raise SystemExit(f"  ! could not clone {src}:\n{p.stderr.strip()}")
            src = tmp
        lines += pull(Path(src), check)
    lines += executable(check) + wire(check) + skill(check)
    if "--alias" in argv:
        lines += alias(check)
    # SAY ONLY WHAT CHANGED, then whether it is good, then the one next step.
    changed = [l for l in lines if l.startswith("  +") or l.startswith("  -") or l.startswith("  !")]
    sys.path.insert(0, str(ROOT))
    import verify
    rows, _ = verify.check(ROOT)
    bad = [(n, note) for n, ok, note in rows if ok is False]
    if check:
        print("Would change:" if changed else "Nothing to change.")
        for l in changed:
            print(l)
        return 0
    for l in changed:
        print(l)
    if bad:
        print("\nNot installed:")
        for n, note in bad:
            print(f"  ✗ {n}" + (f"\n      {note}" if note else ""))
        return 1
    print(("Updated." if src is not None else "Installed.") if changed else "Already installed.")
    print("Start Claude Code in this project and the journal is on: the agent is handed the")
    print("record at its first message. Run `journal` any time to see where things stand.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
