import re
from pathlib import Path
from dataclasses import dataclass, replace

TRAILING_CUT = re.compile(r"\s*\|\s*(?:tail|head)(?:\s+(?:-[nc]\s*\+?\d+|-\d+))?\s*$")
"""A pipe into tail or head that ends a command, cutting what it printed: the command runs whole, the whole is kept, and the cut is applied to it before the agent sees it."""
READERS = {"cat", "sed", "grep", "egrep", "fgrep", "rg", "ag", "head", "tail", "less", "more", "bat", "awk", "jq", "wc", "ls", "find", "tree", "diff", "stat", "file", "nl", "sqlite3"}
"""Commands run to read on purpose, whose output the agent asked to see."""
SEARCHERS = {"grep", "egrep", "fgrep", "rg", "ag", "find"}
"""The reading commands that search, as a magnifying glass does, rather than read a file through."""
GIT_READS = {"show", "diff", "log", "status", "blame", "grep", "ls-files"}
"""The git subcommands that only read."""
CODE = re.compile(r"\.(py|pyi|vue|js|mjs|cjs|jsx|ts|tsx|cs|go|rs|swift|kt|kts|java|scala|php|rb|ex|exs|erl|hs|ml|clj|c|h|cc|cpp|hpp|m|mm|lua|dart|r|jl|sh|bash|zsh|fish|ps1|sql|css|scss|sass|less|html|htm|svelte|astro|json|jsonl|yaml|yml|toml|ini|cfg|xml|gradle|tf|proto|graphql|md|txt)\b")
"""A file the agent reads as code or as the project's own text: reading it is the work itself, so it is run as written in the shell, pipes and all, nothing captured or kept."""
WRITING = re.compile(r"(^|\s)-i(\s|$)|>|\btee\b")
"""A reading command that writes after all: an in-place edit, a redirect into a file, or a tee."""


@dataclass(frozen=True)
class Part:
    """One command of a chain: whether it is the agent's own, recorded, or the shell's own wrapping, run in silence; whether it runs whatever the part before it came to (after a ;) or only after a success (after a &&); and whether a && follows it, so that its failure must not end a shell under set -e."""

    text: str
    recorded: bool = True
    always: bool = True
    guarded: bool = False

    def kind(self) -> str:
        return ("R" if self.recorded else "S") + (";" if self.always else "&") + ("&" if self.guarded else ";")

    def is_read(self) -> bool:
        """A command run to read something on purpose: a file, a search, a log."""
        words = self.text.split()
        program = words[0].rsplit("/", 1)[-1] if words else ""
        return len(words) > 1 and words[1] in GIT_READS if program == "git" else program in READERS

    def is_bare_echo(self) -> bool:
        words = self.text.split()
        return bool(words) and words[0] == "echo" and not WRITING.search(self.text) and "$(" not in self.text and "`" not in self.text

    def is_search(self) -> bool:
        words = self.text.split()
        return bool(words) and words[0].rsplit("/", 1)[-1] in SEARCHERS

    def is_reading_code(self) -> bool:
        """A command that only reads, and names the project's own code: a code file or glob, or a path that exists under the project, none outside it and none in the journal's own folder."""
        paths = [word for word in (w.strip("'\"") for w in self.text.split()[1:]) if CODE.search(word) or self.is_project_path(word)]
        return self.is_read() and not WRITING.search(self.text) and bool(paths) and all(self.is_under_project(word) for word in paths)

    @staticmethod
    def is_project_path(word: str) -> bool:
        return not word.startswith("-") and Path(word).exists()

    @staticmethod
    def is_under_project(word: str) -> bool:
        root = str(Path.cwd())
        return (not word.startswith(("/", "~", "..")) or word.startswith(root)) and not word.startswith((".journal/", f"{root}/.journal/"))

    def cut(self) -> str:
        found = TRAILING_CUT.search(self.text)
        if not self.recorded or found is None or "<<" in self.text or self.is_reading_code():
            return ""
        before = self.text[:found.start()]
        return found.group(0).strip() if before.count("'") % 2 == 0 and before.count('"') % 2 == 0 else ""

    def cut_command(self) -> str:
        return self.cut().lstrip("| ").strip()

    def uncut(self) -> "Part":
        cut = self.cut()
        return replace(self, text=self.text[:self.text.rindex(cut)].rstrip()) if cut else self
