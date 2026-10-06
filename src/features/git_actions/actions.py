import re
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from engine.git import Checkout, checkout_of
from engine.journal_calls import pieces
from engine.proc import git

VALUED = frozenset({"-m", "--message", "-b", "-B", "-F", "--onto", "-X", "--mainline"})
FINISHING = frozenset({"--abort", "--continue", "--skip", "--quit"})
FAILED = re.compile(r"^(?:fatal|error):|^CONFLICT|^! \[rejected\]|^Aborting|^Automatic merge failed", re.M)
UP_TO_DATE = re.compile(r"Already up[ -]to[ -]date")
SHELL_VARIABLE = re.compile(r"\$(?:\w+|\{\w+\})")
SHA = re.compile(r"[0-9a-f]{7,40}")
STASH_VERBS = frozenset({"pop", "apply", "drop"})
STASH_PAST = {"pop": "Popped", "apply": "Applied", "drop": "Dropped"}
MARKS: dict[str, Callable[["GitCall"], str]] = {}


def marks(verb: str):
    def register(describe: Callable[["GitCall"], str]):
        MARKS[verb] = describe
        return describe
    return register


@dataclass(frozen=True)
class GitCall:
    verb: str
    args: tuple[str, ...]
    flags: frozenset[str]
    values: dict[str, str]
    output: str
    checkout: Checkout

    @property
    def branch(self) -> str:
        return self.checkout.branch

    @property
    def remote(self) -> str:
        return self.args[0] if self.args else "origin"

    def has(self, *flags: str) -> bool:
        return bool(self.flags & set(flags))

    def location(self, path: str) -> str:
        return path.rstrip("/").rsplit("/", 1)[-1] if SHELL_VARIABLE.search(path) else path

    def short(self, ref: str) -> str:
        return ref[:7] if SHA.fullmatch(ref) else ref

    def mark(self) -> str:
        describe = MARKS.get(self.verb)
        if not describe or FAILED.search(self.output) or self.has(*FINISHING):
            return ""
        return describe(self)


def calls(shell: str, output: str, folder: Path) -> list[GitCall]:
    return [call for words in pieces(shell) if (call := parse(words, output, folder))]


def parse(words: tuple[str, ...], output: str, folder: Path) -> GitCall | None:
    if words[0] != "git":
        return None
    rest, where = list(words[1:]), folder
    while rest and rest[0].startswith("-"):
        option = rest.pop(0)
        if option == "-C" and rest:
            where = folder / rest.pop(0)
        elif option == "-c" and rest:
            rest.pop(0)
    checkout = checkout_of(where)
    if not rest or not checkout:
        return None
    verb, args, flags, values = rest.pop(0), [], set(), {}
    while rest:
        word = rest.pop(0)
        if word in VALUED and rest:
            values[word] = rest.pop(0)
        elif word.startswith("-"):
            flags.add(word)
        else:
            args.append(word)
    return GitCall(verb, tuple(args), frozenset(flags), values, output, checkout)


@marks("stash")
def stash(call: GitCall) -> str:
    verb = call.args[0] if call.args else "push"
    if verb in STASH_VERBS:
        which = f"`{call.args[1]}`" if len(call.args) > 1 else "the latest stash"
        return f"{STASH_PAST[verb]} {which}"
    if verb not in ("push", "save") or "No local changes" in call.output:
        return ""
    files = len(git(["stash", "show", "--name-only", "stash@{0}"], call.checkout.top).split())
    return f"Stashed {files} changed file{'' if files == 1 else 's'}"


@marks("merge")
def merge(call: GitCall) -> str:
    return f"Merged `{call.args[0]}` into `{call.branch}`" if call.args and not UP_TO_DATE.search(call.output) else ""


@marks("rebase")
def rebase(call: GitCall) -> str:
    onto = call.values.get("--onto") or (call.args[0] if call.args else "")
    return f"Rebased `{call.branch}` onto `{onto}`" if onto else ""


@marks("cherry-pick")
def cherry_pick(call: GitCall) -> str:
    return f"Cherry-picked {', '.join(f'`{call.short(ref)}`' for ref in call.args)} onto `{call.branch}`" if call.args else ""


@marks("revert")
def revert(call: GitCall) -> str:
    return f"Reverted {', '.join(f'`{call.short(ref)}`' for ref in call.args)} on `{call.branch}`" if call.args else ""


@marks("reset")
def reset(call: GitCall) -> str:
    mode = next((flag[2:] + " " for flag in ("--hard", "--soft", "--mixed", "--keep") if flag in call.flags), "")
    target = call.args[0] if call.args else "HEAD"
    if not mode and call.args and not git(["rev-parse", "--verify", "-q", f"{target}^{{commit}}"], call.checkout.top):
        return ""
    return f"Reset `{call.branch}` {mode}to `{target}`"


@marks("tag")
def tag(call: GitCall) -> str:
    if not call.args or call.has("-l", "--list", "-v", "--verify"):
        return ""
    if call.has("-d", "--delete"):
        return f"Deleted tag `{call.args[0]}`"
    return f"Tagged `{call.args[0]}`"


@marks("push")
def push(call: GitCall) -> str:
    if call.has("--dry-run", "-n"):
        return ""
    if call.has("--tags"):
        return f"Pushed tags to `{call.remote}`"
    refs = call.args[1:] or [call.branch]
    names = ", ".join(f"`{ref}`" for ref in refs)
    if call.has("--delete", "-d"):
        return f"Deleted {names} on `{call.remote}`"
    return f"Pushed {names} to `{call.remote}`"


@marks("pull")
def pull(call: GitCall) -> str:
    if UP_TO_DATE.search(call.output):
        return ""
    return f"Pulled `{call.args[1] if len(call.args) > 1 else call.branch}` from `{call.remote}`"


@marks("fetch")
def fetch(call: GitCall) -> str:
    return "Fetched from every remote" if call.has("--all") else f"Fetched from `{call.remote}`"


@marks("worktree")
def worktree(call: GitCall) -> str:
    if len(call.args) < 2:
        return ""
    verb, path = call.args[:2]
    path = call.location(path)
    if verb == "remove":
        return f"Removed worktree `{path}`"
    if verb != "add":
        return ""
    branch = call.values.get("-b") or call.values.get("-B") or (call.args[2] if len(call.args) > 2 else "")
    return f"Added worktree `{path}`" + (f" on branch `{branch}`" if branch else "")


@marks("branch")
def branch(call: GitCall) -> str:
    if not call.args:
        return ""
    if call.has("-d", "-D", "--delete"):
        return f"Deleted branch {', '.join(f'`{name}`' for name in call.args)}"
    if call.has("-m", "-M", "--move"):
        return f"Renamed branch `{call.args[0]}` to `{call.args[-1]}`"
    return "" if call.flags - {"-f", "--force"} else f"Created branch `{call.args[0]}`"
