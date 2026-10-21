import os
import re

from journal.features.shell.support.part import CODE, INPLACE_EDITORS, Part
from journal.support.chain import Chain

COMMANDS = {"tee", "cp", "mv", "rm", "mkdir", "touch", "rsync", "ln", "chmod", "chown", "truncate", "dd", "patch", "install", "rmdir"}
GIT = {"checkout", "restore", "apply", "merge", "rebase", "pull", "stash", "reset", "clean", "switch", "cherry-pick", "revert", "mv", "rm"}
INTERPRETERS = {"python", "python3", "node", "ruby", "perl", "php", "bash", "sh", "zsh"}
MARKERS = re.compile(r"write_text|write_bytes|open\([^)]*[\"'][wax]|\.write\(|unlink|os\.remove|shutil\.|os\.rename|\.rename\(|mkdir|writeFileSync|writeFile\(|fs\.write|File\.(write|open|delete)|rm_rf|\.truncate\(")
REDIRECT = re.compile(r"(?<![<>&\d])(?:\d?>>?)\s*(?!&|/dev/null)\S")
REDIRECTED = re.compile(r"(?<![<>&\d])\d?>>?\s*(?!&|/dev/null)([^\s;&|]+)")
QUOTED_PATH = re.compile(r"['\"]([^'\"\s]*/[^'\"\s]*)['\"]")
HEREDOC = re.compile(r"<<-?\s*['\"]?(\w+)['\"]?")


class Writes:
    """Whether a shell line changes files, read from its text before it runs, as the editor's own tools are known to: the write gates apply to a script as much as to an edit. A line is a write of the project's code when its writing parts write code files, folders or dotfiles under the project and its other parts read, check or move into the project."""

    @classmethod
    def of(cls, line: str) -> bool:
        return any(cls.part(p.text) for p in Chain.parts(line) if p.recorded)

    @classmethod
    def part(cls, text: str) -> bool:
        part = Part(text)
        tokens = cls.tokens_of(part)
        if not tokens or tokens[0].endswith("journal"):
            return False
        if REDIRECT.search(part.unquoted()):
            return True
        name = tokens[0].rsplit("/", 1)[-1]
        if name in INPLACE_EDITORS:
            return part.edits_in_place() or bool(MARKERS.search(text))
        if name in COMMANDS:
            return True
        if name == "git":
            return len(tokens) > 1 and tokens[1] in GIT
        if name == "find":
            return "-delete" in tokens or "-exec" in tokens and cls.part(" ".join(tokens[tokens.index("-exec") + 1:]))
        if name == "xargs":
            return cls.part(" ".join(tokens[1:]))
        if name in INTERPRETERS:
            return bool(MARKERS.search(text))
        return any(cls.part(piped) for piped in part.unquoted().split("|")[1:])

    @staticmethod
    def tokens_of(part: Part) -> list[str]:
        return [w for w in part.tokens() if "=" not in w or w.startswith("-")]

    @classmethod
    def is_code_write_line(cls, line: str) -> bool:
        own = [p for p in Chain.parts(line) if p.recorded]
        writing = [p for p in own if cls.part(p.text)]
        return bool(writing) and all(cls.writes_code_inside(p.text) if cls.part(p.text) else p.is_read() or p.is_harmless() or p.is_cd_into_project() for p in own)

    @classmethod
    def writes_code_inside(cls, text: str) -> bool:
        targets = cls.part_targets(text)
        return bool(targets) and all(cls.is_code_target(t) for t in targets)

    @staticmethod
    def is_code_target(target: str) -> bool:
        name = os.path.basename(target.rstrip("/"))
        return Part.is_under_project(target) and (bool(CODE.search(target)) or "." not in name.lstrip("."))

    @classmethod
    def targets(cls, line: str) -> list[str]:
        return [target for p in Chain.parts(line) if p.recorded for target in cls.part_targets(p.text)]

    @classmethod
    def part_targets(cls, text: str) -> list[str]:
        part = Part(text)
        plain = part.unquoted()
        tokens = cls.tokens_of(Part(plain))
        if not tokens or tokens[0].endswith("journal"):
            return []
        name = tokens[0].rsplit("/", 1)[-1]
        named = cls.named_targets(name, tokens, text)
        script = cls.script_of(text)
        if name in INTERPRETERS and MARKERS.search(script):
            named += QUOTED_PATH.findall(script) + [w for w in script.split() if "/" in w] + [w for w in Part(plain.split("\n")[0]).tokens()[1:] if "/" in w or CODE.search(w)]
        piped = [t for segment in plain.split("|")[1:] for t in cls.part_targets(segment)]
        if not piped and any(cls.part(segment) for segment in plain.split("|")[1:]):
            piped = [w for w in tokens[1:] if not w.startswith("-") and Part.is_project_path(w)]
        return REDIRECTED.findall(plain) + named + piped

    @classmethod
    def named_targets(cls, name: str, tokens: list[str], text: str) -> list[str]:
        if (name in COMMANDS or name in INPLACE_EDITORS) and cls.part(text):
            return [w for w in tokens[1:] if not w.startswith("-")]
        if name == "git" and len(tokens) > 1 and tokens[1] in GIT:
            return [w for w in tokens[2:] if not w.startswith("-")]
        if name == "find" and cls.part(text):
            return [w for w in tokens[1:2] if not w.startswith("-")]
        if name == "xargs":
            return cls.part_targets(" ".join(tokens[1:]))
        return []

    @staticmethod
    def script_of(text: str) -> str:
        opening = HEREDOC.search(text)
        if not opening:
            return text
        body = text.split("\n")[1:]
        end = next((i for i, line in enumerate(body) if line.strip() == opening.group(1)), len(body))
        return "\n".join(body[:end])
