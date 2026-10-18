import re

from journal.features.shell.chain import Chain

COMMANDS = {"sed": ("-i",), "tee": (), "cp": (), "mv": (), "rm": (), "mkdir": (), "touch": (), "rsync": (), "ln": (), "chmod": (), "chown": (), "truncate": (), "dd": (), "patch": (), "install": (), "rmdir": ()}
"""Commands that change files, with the flag that makes them do so when one is needed."""
GIT = {"checkout", "restore", "apply", "merge", "rebase", "pull", "stash", "reset", "clean", "switch", "cherry-pick", "revert", "mv", "rm"}
"""Git verbs that move the working tree."""
INTERPRETERS = {"python", "python3", "node", "ruby", "perl", "php", "bash", "sh", "zsh"}
MARKERS = re.compile(r"write_text|write_bytes|open\([^)]*[\"'][wax]|\.write\(|unlink|os\.remove|shutil\.|os\.rename|\.rename\(|mkdir|writeFileSync|writeFile\(|fs\.write|File\.(write|open|delete)|rm_rf|\.truncate\(")
"""What a script says when it writes."""
REDIRECT = re.compile(r"(?<![<>&\d])(?:\d?>>?)\s*(?!&|/dev/null)\S")
"""A redirection into a file, not into a descriptor or the void."""
REDIRECTED = re.compile(r"(?<![<>&\d])\d?>>?\s*(?!&|/dev/null)([^\s;&|]+)")
"""The file a redirection writes to."""
QUOTED_PATH = re.compile(r"['\"]([^'\"\s]*/[^'\"\s]*)['\"]")
"""A path a script names in quotes."""
HEREDOC = re.compile(r"<<-?\s*['\"]?(\w+)['\"]?")
"""A heredoc's start, with the word that ends it."""
PREFIXES = {"sudo", "env", "nohup", "time", "nice", "command", "exec", "xargs"}


class Writes:
    """Whether a shell line changes files, read from its text before it runs, as the editor's own tools are known to: the write gates apply to a script as much as to an edit."""

    @classmethod
    def of(cls, line: str) -> bool:
        return any(cls.part(p.text) for p in Chain.parts(line) if p.recorded)

    @classmethod
    def part(cls, text: str) -> bool:
        words = [w for w in cls.unquoted(text).split() if "=" not in w or w.startswith("-")]
        while words and words[0] in PREFIXES:
            words = words[1:]
        if not words or words[0].endswith("journal"):
            return False
        if REDIRECT.search(cls.unquoted(text)):
            return True
        name = words[0].rsplit("/", 1)[-1]
        if name in COMMANDS:
            return all(flag in words for flag in COMMANDS[name])
        if name == "git":
            return len(words) > 1 and words[1] in GIT
        if name in INTERPRETERS:
            return bool(MARKERS.search(text))
        return any(cls.part(piped) for piped in cls.unquoted(text).split("|")[1:])

    @classmethod
    def targets(cls, line: str) -> list[str]:
        """The words a shell line writes to: each redirection's file, the arguments of a command that writes files, and every path an interpreter's script names when it writes."""
        return [target for p in Chain.parts(line) if p.recorded for target in cls.part_targets(p.text)]

    @classmethod
    def part_targets(cls, text: str) -> list[str]:
        plain = cls.unquoted(text)
        words = [w for w in plain.split() if "=" not in w or w.startswith("-")]
        while words and words[0] in PREFIXES:
            words = words[1:]
        if not words or words[0].endswith("journal"):
            return []
        name = words[0].rsplit("/", 1)[-1]
        named = [w for w in words[1:] if not w.startswith("-")] if name in COMMANDS and cls.part(text) else []
        script = cls.script_of(text)
        named += QUOTED_PATH.findall(script) + [w for w in script.split() if "/" in w] if name in INTERPRETERS and MARKERS.search(script) else []
        return REDIRECTED.findall(plain) + named + [t for piped in plain.split("|")[1:] for t in cls.part_targets(piped)]

    @staticmethod
    def script_of(text: str) -> str:
        """What an interpreter is handed to run: a heredoc's body up to its end line, else the whole line; commands after the heredoc are not the script."""
        found = HEREDOC.search(text)
        if not found:
            return text
        body = text.split("\n")[1:]
        end = next((i for i, line in enumerate(body) if line.strip() == found.group(1)), len(body))
        return "\n".join(body[:end])

    @staticmethod
    def unquoted(text: str) -> str:
        """The text with its quoted stretches blanked, so a > inside quotes is not a redirection."""
        return re.sub(r"'[^']*'|\"(?:\\\\.|[^\"\\\\])*\"", " ", text)
