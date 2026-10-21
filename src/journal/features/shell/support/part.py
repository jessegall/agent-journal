import glob
import os
import re
import shlex
from pathlib import Path
from dataclasses import dataclass, replace

TRAILING_CUT = re.compile(r"\s*\|\s*(?:tail|head)(?:\s+(?:-[nc]\s*\+?\d+|-\d+))?\s*$")
READERS = {"cat", "sed", "grep", "egrep", "fgrep", "rg", "ag", "head", "tail", "less", "more", "bat", "awk", "jq", "wc", "ls", "find", "tree", "diff", "stat", "file", "nl", "sqlite3"}
SEARCHERS = {"grep", "egrep", "fgrep", "rg", "ag", "find", "ls", "tree"}
GIT_READS = {"show", "diff", "log", "status", "blame", "grep", "ls-files"}
GIT_OPTIONS = {"--no-pager", "-c", "-C", "--git-dir", "--work-tree", "-p", "-P"}
CODE = re.compile(r"\.(py|pyi|vue|js|mjs|cjs|jsx|ts|tsx|cs|go|rs|swift|kt|kts|java|scala|php|rb|ex|exs|erl|hs|ml|clj|c|h|cc|cpp|hpp|m|mm|lua|dart|r|jl|sh|bash|zsh|fish|ps1|sql|css|scss|sass|less|html|htm|svelte|astro|json|jsonl|yaml|yml|toml|ini|cfg|xml|gradle|tf|proto|graphql|md|txt)\b")
WRITING = re.compile(r">>?(?!\s*/dev/null|&[0-9])|\btee\b")
INPLACE_EDITORS = {"sed", "perl"}
VENDOR_FOLDERS = {"node_modules", "dist", "build", ".venv", "venv", "__pycache__", ".git", ".journal"}
LOCKS = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock", "Cargo.lock", "uv.lock", "Pipfile.lock", "composer.lock"}
HARMLESS = {"echo", "printf", "test", "[", "[[", "true", ":", "pwd", "set"}
PREFIXES = {"sudo", "env", "nohup", "time", "nice", "command", "exec"}


@dataclass(frozen=True)
class Part:
    """One command of a chain: whether it is the agent's own, recorded, or the shell's own wrapping, run in silence; whether it runs whatever the part before it came to (after a ;) or only after a success (after a &&); and whether a && follows it, so that its failure must not end a shell under set -e. It reads its own tokens as the shell would: quotes removed, a leading comment, env assignments, prefixes and git's own options stepped over."""

    text: str
    recorded: bool = True
    always: bool = True
    guarded: bool = False

    def kind(self) -> str:
        return ("R" if self.recorded else "S") + (";" if self.always else "&") + ("&" if self.guarded else ";")

    def tokens(self) -> list[str]:
        try:
            split = shlex.split(self.command_text(), posix=True)
        except ValueError:
            split = self.command_text().split()
        return self.led(split)

    def command_text(self) -> str:
        lines = self.text.split("\n")
        return "\n".join(lines[next((i for i, line in enumerate(lines) if not line.lstrip().startswith("#")), len(lines)):])

    def unquoted(self) -> str:
        return re.sub(r"'[^']*'|\"(?:\\.|[^\"\\])*\"", " ", self.command_text())

    @staticmethod
    def led(tokens: list[str]) -> list[str]:
        while tokens and ("=" in tokens[0] and not tokens[0].startswith("-") or tokens[0] in PREFIXES):
            tokens = tokens[1:]
        if tokens and tokens[0].rsplit("/", 1)[-1] == "git":
            rest = tokens[1:]
            while rest and (rest[0] in GIT_OPTIONS or rest[0].startswith(("--git-dir=", "--work-tree="))):
                rest = rest[2:] if rest[0] in ("-c", "-C", "--git-dir", "--work-tree") else rest[1:]
            return ["git", *rest]
        return tokens

    def program(self) -> str:
        tokens = self.tokens()
        return tokens[0].rsplit("/", 1)[-1] if tokens else ""

    def is_read(self) -> bool:
        tokens = self.tokens()
        return (len(tokens) > 1 and tokens[1] in GIT_READS if self.program() == "git" else self.program() in READERS) and not self.edits_in_place()

    def is_harmless(self) -> bool:
        return self.program() in HARMLESS and not WRITING.search(self.unquoted()) and "$(" not in self.text and "`" not in self.text

    def is_cd_into_project(self) -> bool:
        tokens = self.tokens()
        return len(tokens) == 2 and tokens[0] == "cd" and self.is_under_project(tokens[1])

    def is_search(self) -> bool:
        return self.program() in SEARCHERS or self.program() == "git" and self.tokens()[1:2] == ["grep"]

    def edits_in_place(self) -> bool:
        return self.program() in INPLACE_EDITORS and any(w.startswith(("-i", "-pi")) for w in self.tokens()[1:])

    def is_reading_code(self) -> bool:
        tokens = self.tokens()
        if not self.is_read() or self.program() == "sqlite3" or WRITING.search(self.unquoted()) or self.edits_in_place() or self.tails_forever():
            return False
        paths = [word for word in tokens[1:] if CODE.search(word) or self.is_project_path(word)]
        return all(self.is_under_project(word) for word in paths) and (bool(paths) or self.is_search() and not self.has_outside_folder())

    def has_outside_folder(self) -> bool:
        return any(word.startswith(("/", "~", "..", "$")) for word in self.tokens()[1:] if not word.startswith("-"))

    def tails_forever(self) -> bool:
        return self.program() == "tail" and any(w in ("-f", "-F") or w.startswith("-") and "f" in w[1:] and not w.startswith("--") for w in self.tokens()[1:])

    @staticmethod
    def is_project_path(word: str) -> bool:
        if word.startswith(("-", "$")):
            return False
        expanded = os.path.expanduser(word)
        return Path(expanded).exists() or any(ch in word for ch in "*?{") and bool(glob.glob(expanded))

    @classmethod
    def is_under_project(cls, word: str) -> bool:
        if word.startswith("$"):
            return False
        root = Path.cwd().resolve()
        path = Path(os.path.normpath(os.path.expanduser(word)))
        if path.is_absolute():
            if path != root and root not in path.parents:
                return False
            parts = path.relative_to(root).parts
        else:
            if path.parts[:1] == ("..",):
                return False
            parts = path.parts
        if parts[:2] == (".journal", "worktrees"):
            parts = parts[3:]
        return not any(part in VENDOR_FOLDERS for part in parts) and not (parts and parts[-1] in LOCKS)

    def cut(self) -> str:
        trailing = TRAILING_CUT.search(self.text)
        if not self.recorded or trailing is None or "<<" in self.text or self.is_reading_code():
            return ""
        before = self.text[:trailing.start()]
        return trailing.group(0).strip() if before.count("'") % 2 == 0 and before.count('"') % 2 == 0 else ""

    def cut_command(self) -> str:
        return self.cut().lstrip("| ").strip()

    def uncut(self) -> "Part":
        cut = self.cut()
        return replace(self, text=self.text[:self.text.rindex(cut)].rstrip()) if cut else self
