#!/usr/bin/env python3
"""install — wire the journal into a project that has just downloaded it.

    .journal/install.py           wire the hooks, make things executable
    .journal/install.py --alias   also put a `journal` command on your PATH (every shell)
    .journal/install.py --git-hook    also install a git post-commit hook, so a commit you
                                      make yourself closes the to-do its trailer names
    .journal/install.py --no-git-hook remove that hook, if it is the one this wrote
    .journal/install.py --check   say what would change, write nothing
    .journal/install.py --from <path or git url>   pull that package in first (tests run before anything lands)

WHAT THIS IS CAREFUL ABOUT, and why each one is a real way to lose somebody's work:

MERGE, NEVER OVERWRITE. `.claude/settings.json` is the user's file and this is a guest
in it. There may be other hooks in there, on these very events, that matter more than
this one. So the file is read, the journal's entries are added to whatever is already
there, and everything else is passed through untouched. A tool that writes its own
config over yours is a tool you cannot adopt incrementally.

IDEMPOTENT. Running it twice must not wire the hook twice — a duplicated Stop hook fires
twice per stop, holds twice, and reads like the check is broken rather than like the
install is. So an entry already pointing at `hook.py` counts as done.

IT REFUSES TO GUESS ABOUT MALFORMED JSON. If `settings.json` does not parse, this stops
and says so rather than starting from `{}`. Starting fresh would silently delete every
hook the user had, and the failure would look like an install that worked.

--from PULLS THE PACKAGE, NEVER THE DATA. The code, the tests and the skill come across;
the record, the settings and the runtime files are this project's and stay. A pull is a
copy: the package is tested where it is developed, not in every consumer. `--test` runs
the pulled copy's suites first, for the one time you want that. Until this existed every
update to a consumer was an rsync by hand, and "the consumer has the latest" was a
belief.

AND IT DOES NOT CLAIM SUCCESS. The last thing it does is run `verify`, which reports
WIRED and FIRED as two separate facts. Installing can only ever prove the first one. The
tool this replaces sat wired and silent for seventeen hours, so `install` finishing is
deliberately not the same as the journal being in force.
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
EVENTS = ("Stop", "SessionStart", "SessionEnd", "PostToolUse", "PreToolUse",
          "UserPromptSubmit")

#: EVENTS THIS PACKAGE ONCE WIRED AND MUST NOW UNWIRE, because leaving them is worse than
#: never having added them.
#:
#: `WorktreeCreate` IS NOT AN OBSERVER EVENT — IT IS THE PROVIDER OF THE WORKTREE. 1.42.0
#: read the name and assumed it announced a worktree Claude Code had made; it does the
#: opposite. The hook is expected to CREATE the directory and echo its path, and the harness
#: uses what comes back:
#:
#:     WorktreeCreate hook returned a path that is not a directory: …
#:     The hook must create the directory before echoing its path.
#:
#: So wiring it did not observe worktree creation, it HIJACKED it — every worktree-backed
#: dispatch failed at creation in any project with the journal installed.
#:
#: AND IT WAS NEVER NEEDED. `worktree.resolve` runs at the import of `hook.py`, so a
#: worktree's journal is linked by the first tool call anybody makes inside it — which is
#: also the only thing that works for a subagent, since nothing fires a SessionStart for one.
#: The event bought nothing and cost the feature it was named after.
RETIRED_EVENTS = ("WorktreeCreate",)
#: What goes in settings.json — and it WALKS UP, because the journal is not always beside
#: the directory Claude Code was started in.
#:
#: IT USED TO BE `"$CLAUDE_PROJECT_DIR"/.journal/hook.py`, which is right exactly when the
#: session starts at the folder holding `.journal`. Two ordinary layouts break it and both
#: are in daily use:
#:
#:   A ROOT THAT IS NOT A REPOSITORY, with the repositories under it — `worldwatchmarket/`
#:   holds the journal, and `chronos/`, `site/` and `help-center/` are separate repositories
#:   inside it. An agent working in `chronos/` has no `.journal` beside it and the hook
#:   never fires; nothing announces that, because a hook that is not registered is silent by
#:   definition.
#:
#:   A WORKTREE, including the ones Claude Code makes itself under `.claude/worktrees/`.
#:   Three levels below a repository that is itself below the journal.
#:
#: So the command walks up from wherever it starts until it finds an installation, and execs
#: it. `$CLAUDE_PROJECT_DIR` is still the starting point and still quoted — a path with a
#: space in it otherwise splits into two arguments and the hook simply never runs — but it
#: is now the first place looked rather than the only one. `${CLAUDE_PROJECT_DIR:-$PWD}`
#: because a harness that does not set it at all should still work.
#:
#: BOUNDED, AND SILENT WHEN THERE IS NOTHING. Forty levels is far above any real project,
#: and exiting 0 with no output is what a hook does when it has nothing to say — a journal
#: that is not installed above you is not an error, it is a different project.
COMMAND = (
    'd="${CLAUDE_PROJECT_DIR:-$PWD}"; n=0; '
    'while [ -n "$d" ] && [ "$d" != "/" ] && [ "$n" -lt 40 ]; do '
    'if [ -x "$d/.journal/hook.py" ]; then exec "$d/.journal/hook.py"; fi; '
    'd=$(dirname "$d"); n=$((n+1)); done; exit 0'
)
#: WHICH FILES MUST BE EXECUTABLE — asked of the files, not of a list beside them. It was a
#: hand-kept tuple of sixteen names, and it went stale the day a suite was deleted: install
#: reported "test_delegate.py is missing" about a file nobody wanted any more. A list that
#: has to be edited whenever the directory changes is a second source of truth for what the
#: directory contains, and the directory always wins.
def _executable(root: Path) -> set[str]:
    """Every .py at the package root that starts with a shebang — that is what makes one."""
    out = set()
    for f in root.glob("*.py"):
        try:
            if f.read_bytes()[:2] == b"#!":
                out.add(f.name)
        except OSError:
            continue
    return out

#: THE SKILL IS PART OF THE PACKAGE, and it has to be installed rather than committed.
#: It teaches the reasoning the injected block has no room for, so it belongs beside the
#: code that enforces those rules — but it has to LAND in `.claude/skills/`, which the
#: harness owns and which several projects gitignore. A skill that only exists where it was
#: first written is one that silently goes missing on the next clone, and nothing about a
#: missing skill looks broken: the agent simply never learns why any of this is here.
#: THE SKILL SHIPS WITH THE PACKAGE. One skill, loaded by every session; the second one
#: (`journal-handoff`) was deleted with the machinery it documented.
SKILLS = (("skill", ".claude/skills/journal"),)

#: WHERE THE PACKAGE'S OWN RULES ARE WRITTEN, besides the block the hook injects. The hook
#: reaches Claude Code and nothing else; these rules bind every agent, and an agent that
#: reads the repo without hooks is exactly the reader they are for. `AGENTS.md` is the
#: harness-agnostic one and `CLAUDE.md` the Claude Code one; both get the same block, and a
#: project that keeps only one gets it there.
BRIEFED = ("AGENTS.md", "CLAUDE.md")


def briefing(project: Path, check: bool, conf: dict) -> list[str]:
    """Write the managed block into each briefing file. Replaced between markers, never merged.

    THE CONVENTION IS THE USER'S OWN, from `code-commandments`: an HTML comment so the
    markers are invisible in rendered markdown, naming the package AND the command that
    regenerates the block — so a reader who edits inside it is told, in the block, why their
    edit will vanish. Everything outside the markers is theirs and is never touched, which
    is what makes this safe to run on every update.

    THREE CASES, ONE FUNCTION: no file, a file with no markers, a file with markers. Create,
    append, replace between.
    """
    import builtin
    out = []
    if not conf.get("builtin_rules", True):
        return out
    block = builtin.block()
    for name in BRIEFED:
        f = project / name
        had = f.read_text() if f.is_file() else ""
        if builtin.BEGIN in had and builtin.END in had:
            head, _, rest = had.partition(builtin.BEGIN)
            _, _, tail = rest.partition(builtin.END)
            want = head + block + tail
        elif had.strip():
            want = had.rstrip() + "\n\n" + block + "\n"
        elif f.is_file():
            want = block + "\n"
        else:
            want = f"# {project.name}\n\n" + block + "\n"
        if want == had:
            out.append(f"  = {name} briefing up to date")
            continue
        if not check:
            f.write_text(want)
        out.append(f"  + {name} briefing written" if had else f"  + {name} created with the briefing")
    return out


#: What belongs to THIS project and never comes across on a pull.
DATA = ("record.json", "record.json.lock", "settings.json", "state.json", "state.json.retired",
        "runtime", "todo", "environments", "docs", "tools", ".journal",
        "__pycache__")


#: THE SUITES ARE NOT THE PACKAGE. They are tested where the package is developed, before it
#: is published; what a consumer gets is a copy of the code. Shipping them anyway put a
#: red suite in front of an agent in a consumer project, and it started fixing the tool
#: instead of doing its own work — a job it was never given. So a pull leaves them out,
#: and removes the ones an earlier pull left behind.
def _is_test(rel: Path) -> bool:
    return len(rel.parts) == 1 and (rel.name == "testkit.py" or (rel.name.startswith("test_") and rel.suffix == ".py"))


def _package_files(root: Path) -> list[Path]:
    """Every file of the package under `root`, relative — code, skill, gitignore; never the suites."""
    out = []
    for f in root.rglob("*"):
        rel = f.relative_to(root)
        # a clone's .git is not the package: copying it once put a nested repository
        # into a consumer's .journal
        if not f.is_file() or rel.parts[0] in DATA or rel.parts[0] == ".git" or f.suffix in (".tmp", ".pyc"):
            continue
        if _is_test(rel):
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
        # REPLACED, NOT OVERWRITTEN. copy2 onto an existing file writes into that inode,
        # and the suites hardlink the package into their fixtures — so a pull inside a test
        # wrote 9.0.0 into the development checkout's VERSION, and a release was tagged
        # with it. Unlinking first breaks the link; the fixture gets a new file, the source
        # keeps its own.
        if not check:
            (ROOT / rel).parent.mkdir(parents=True, exist_ok=True)
            (ROOT / rel).unlink(missing_ok=True)
            shutil.copy2(stage / rel, ROOT / rel)
        out.append(f"  + {rel}" + (" (would update)" if check else ""))
    for rel in gone:
        # PACKAGE OUTPUT ONLY. Anything under DATA never reaches this list, so what is
        # removed is code or skill the source no longer ships — and it is said, by name.
        if not check:
            (ROOT / rel).unlink()
        out.append(f"  - {rel} (no longer in the package)")
    # SUITES AN EARLIER PULL LEFT HERE GO TOO — but only in a consumer. The development
    # checkout is the one place the suites belong, and it is the one that is a git
    # repository; a consumer's .journal never is, because install.sh strips the clone's .git.
    stale = [] if (ROOT / ".git").exists() else sorted(f.relative_to(ROOT) for f in ROOT.glob("*.py") if _is_test(f.relative_to(ROOT)))
    for rel in stale:
        if not check:
            (ROOT / rel).unlink()
        out.append(f"  - {rel} (the suites do not ship; they run where the package is developed)")
    if not changed and not gone and not stale:
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
        # OURS IS ANYTHING THAT RUNS `hook.py`, AND IT IS REWRITTEN, NOT LEFT ALONE. This
        # only ever checked whether SOMETHING mentioning hook.py was wired and then skipped
        # the event — so a project installed before the command learned to walk up would
        # have kept the old one through every upgrade, for ever, and the breakage it fixes
        # is invisible: a hook that is not registered says nothing by definition. The
        # projects that most need this change are exactly the ones already installed.
        ours = [h for b in blocks if isinstance(b, dict)
                for h in (b.get("hooks") or [])
                if isinstance(h, dict) and "hook.py" in str(h.get("command", ""))]
        if ours and all(h.get("command") == COMMAND for h in ours):
            done.append(f"  = {ev} already wired")
            continue
        if ours:
            for h in ours:
                h["command"] = COMMAND
            done.append(f"  ~ {ev} rewired — the old command did not look above its own folder")
            continue
        blocks.append({"hooks": [{"type": "command", "command": COMMAND}]})
        done.append(f"  + {ev} wired")

    # AND WHAT THIS PACKAGE ONCE WIRED AND SHOULD NOT HAVE, IS TAKEN OUT. Only ours: a block
    # that runs `hook.py`. Anything the user wired themselves on the same event is left
    # exactly as it is, because removing what somebody else put there is the mirror of the
    # mistake being undone.
    for ev in RETIRED_EVENTS:
        blocks = data["hooks"].get(ev)
        if not isinstance(blocks, list):
            continue
        keep = []
        dropped = 0
        for b in blocks:
            hooks = (b.get("hooks") or []) if isinstance(b, dict) else []
            mine = [h for h in hooks if isinstance(h, dict) and "hook.py" in str(h.get("command", ""))]
            if mine and len(mine) == len(hooks):
                dropped += 1
                continue
            if mine:
                b["hooks"] = [h for h in hooks if h not in mine]
                dropped += 1
            keep.append(b)
        if not dropped:
            continue
        if keep:
            data["hooks"][ev] = keep
        else:
            data["hooks"].pop(ev, None)
        done.append(f"  - {ev} UNWIRED — that event creates the worktree, it does not "
                    "announce one, and ours was breaking every worktree dispatch")

    if not check and any(d.startswith(("  +", "  ~", "  -")) for d in done):
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(json.dumps(data, indent=2) + "\n")
    return done


def executable(check: bool) -> list[str]:
    """A hook that is not executable fails silently — the harness just gets nothing."""
    out = []
    for name in sorted(_executable(ROOT)):
        p = ROOT / name
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
    out = []
    for src_name, dst_name in SKILLS:
        out += _one_skill(src_name, dst_name, check)
    return out


def _one_skill(SKILL_SRC: str, SKILL_DST: str, check: bool) -> list[str]:
    """One packaged skill folder, copied into place and kept current."""
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


#: The git hook, whole. `post-commit` cannot fail a commit — git ignores its exit code —
#: and this one is written so that it could not anyway: nothing but a read and a close.
GIT_HOOK_MARK = "agent-journal"
GIT_HOOK = """#!/bin/sh
# agent-journal: a commit that names a to-do in its message closes it.
#   Journal: todos done 12
# Remove this file to stop that. `.journal/install.py --no-git-hook` does the same.
top=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ -x "$top/.journal/journal.py" ] || exit 0
"$top/.journal/journal.py" todos from-commit HEAD --quiet || true
"""


def _git_hook_path() -> Path | None:
    """Where this repo keeps its hooks — asked of git, because a worktree's `.git` is a file."""
    try:
        p = subprocess.run(["git", "rev-parse", "--git-path", "hooks"], cwd=str(PROJECT),
                           capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    if p.returncode != 0:
        return None
    d = Path(p.stdout.strip())
    return (d if d.is_absolute() else PROJECT / d) / "post-commit"


def git_hook(check: bool, remove: bool = False) -> list[str]:
    """Install (or take back) the post-commit hook that acts on a commit's trailer.

    OPT-IN, AND IT NEVER CLOBBERS. `.git/hooks` is not the journal's to own: husky, lefthook
    and pre-commit all live there, a hook is not committed so it cannot be reviewed, and a
    tool that overwrites one costs somebody a workflow with no diff to find it in. An
    existing post-commit that is not ours is left exactly as it is and the line to add is
    printed instead. The agent's own commits do not need this at all — those are read at
    PostToolUse — so this is only for the commits a person types.
    """
    f = _git_hook_path()
    if f is None:
        return ["  ! not a git repository — no post-commit hook to install"]
    have = f.read_text() if f.is_file() else ""
    ours = GIT_HOOK_MARK in have
    if remove:
        if not have:
            return ["  = no post-commit hook to remove"]
        if not ours:
            return [f"  ! {f} is not the journal's — left alone"]
        if not check:
            f.unlink()
        return [f"  - {f} removed"]
    if ours and have == GIT_HOOK:
        return ["  = post-commit hook already installed"]
    if ours:
        # A HOOK IS WRITTEN ONCE AND LIVES FOREVER. Its body is not part of the package a
        # pull refreshes, so an install that leaves an older one in place ships a fix nobody
        # receives — the `--quiet` that stopped it printing after every commit was exactly
        # that. Ours and out of date is rewritten; anyone else's is still never touched.
        if not check:
            f.write_text(GIT_HOOK)
            f.chmod(f.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
        return ["  + post-commit hook brought up to date"]
    if have:
        # ONE STRING, because `main` prints only the lines that start with a mark: a
        # continuation printed as its own line is a continuation that never reaches anybody.
        return [f"  ! {f} already exists and is not the journal's — left alone.\n"
                "    Add this line to it to close to-dos from commit trailers:\n"
                '      "$(git rev-parse --show-toplevel)"/.journal/journal.py todos from-commit HEAD --quiet || true']
    if not check:
        f.parent.mkdir(parents=True, exist_ok=True)
        f.write_text(GIT_HOOK)
        f.chmod(f.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    return [f"  + {f} installed — a commit's `Journal: todos done N` trailer closes that to-do"]


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


def _installed_at(root: Path) -> bool:
    """Is this an installed copy, or the package's own source?

    THE PACKAGE LIVES AT `<project>/.journal/`, so `PROJECT` is `ROOT.parent` — right for an
    install, and one level too high when `install.py` is run from a checkout of the package
    itself. Run there, it writes `.claude/settings.json`, the skill and the briefing into
    whatever directory happens to hold the checkout. Measured, by doing it: a `.claude/`
    with hooks and a skill, and two briefing files, appeared in the folder ABOVE this repo.
    Nothing was lost — they were new files — but nothing asked, either.
    """
    return root.name == ".journal"


def main(argv: list[str]) -> int:
    sys.path.insert(0, str(ROOT))
    import fmt
    if any(a in ("-h", "--help", "help") for a in argv):
        fmt.say(__doc__)
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
    import settings as _settings
    _conf, _ = _settings.load(ROOT)
    lines += executable(check)
    # A CHECKOUT OF THE PACKAGE IS NOT A PROJECT TO INSTALL INTO. Everything below writes
    # into `PROJECT`, and from a source checkout that is the directory above the checkout.
    # The executable bits are the exception: they are on the package's own files.
    if not _installed_at(ROOT):
        lines.append(f"  · {ROOT.name}/ is the package's source, not an install — wiring, "
                     "the skill and the briefing are for a project's `.journal/`, and were "
                     "skipped so they do not land in "
                     f"{PROJECT.name}/")
    else:
        lines += wire(check) + skill(check) + briefing(PROJECT, check, _conf)
    if "--alias" in argv:
        lines += alias(check)
    if "--git-hook" in argv:
        lines += git_hook(check)
    if "--no-git-hook" in argv:
        lines += git_hook(check, remove=True)
    # SAY ONLY WHAT CHANGED, then whether it is good, then the one next step.
    changed = [l for l in lines if l.startswith("  +") or l.startswith("  -") or l.startswith("  !")]
    import verify
    rows, _ = verify.check(ROOT)
    bad = [(n, note) for n, ok, note in rows if ok is False]
    if check:
        fmt.say("\n".join(["Would change:" if changed else "Nothing to change.", *changed]))
        return 0
    if changed:
        fmt.say("\n".join(changed))
    if bad:
        fmt.say("\n".join(["", "Not installed:",
                           *(f"  ✗ {n}" + (f"\n      {note}" if note else "") for n, note in bad)]))
        return 1
    fmt.say(("Updated." if src is not None else "Installed.") if changed else "Already installed.")
    fmt.say("Start Claude Code in this project and the journal is on: the agent is handed the\n"
            "record at its first message. Run `journal` any time to see where things stand.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
