import re

from journal.features.shell.part import Part

WRAPPED = re.compile(r"^eval '(.*)' < /dev/null$", re.S)
"""Claude Code runs the agent's command as eval '<command>' < /dev/null between its own set-up and a pwd: the command inside is what the agent wrote."""
QUOTE = "'\"'\"'"
OPENS = {"for": "done", "while": "done", "until": "done", "if": "fi", "case": "esac"}
"""A compound command runs from its opening word to its closing one, whatever separators lie between."""


class Chain:
    """A shell line taken apart at its && and ; into the commands it chains, quotes, subshells, groups, loops and pipes respected: a pipe is one pipeline, not a chain."""

    @classmethod
    def parts(cls, line: str) -> list[Part]:
        """The chain's commands in order: the agent's own recorded, the shell's wrapping around them silent."""
        parts = cls.split(line)
        if not any(WRAPPED.match(p) for p in parts):
            return [Part(p) for p in parts]
        return [part for p in parts for part in cls.of(p)]

    @classmethod
    def of(cls, part: str) -> list[Part]:
        inner = cls.unwrapped(part)
        return [Part(p) for p in inner] if inner is not None else [Part(part, recorded=False)]

    @classmethod
    def unwrapped(cls, part: str) -> list[str] | None:
        wrapped = WRAPPED.match(part)
        return cls.split(wrapped.group(1).replace(QUOTE, "'")) if wrapped else None

    @classmethod
    def split(cls, line: str) -> list[str]:
        return cls.compound(cls.simple(line))

    @staticmethod
    def simple(line: str) -> list[tuple[str, str]]:
        """Each command with the separator before it, split outside quotes, subshells, groups and comments."""
        parts, current, quote, depth, separator, i = [], "", "", 0, "", 0
        while i < len(line):
            c = line[i]
            if c == "#" and not quote and (i == 0 or line[i - 1] in " \t\n"):
                end = line.find("\n", i)
                end = len(line) if end < 0 else end
                current, i = current + line[i:end], end
                continue
            if c == "\\" and quote != "'" and i + 1 < len(line):
                current, i = current + line[i:i + 2], i + 2
                continue
            if quote:
                quote, current, i = "" if c == quote else quote, current + c, i + 1
                continue
            if c in "\"'":
                quote, current, i = c, current + c, i + 1
                continue
            if c == "(" or (c == "{" and line[i + 1:i + 2] in (" ", "\t")):
                depth += 1
            elif c in ")}" and depth:
                depth -= 1
            found = "&&" if line.startswith("&&", i) else ";" if c == ";" and not line.startswith(";;", i) else ""
            if found and not depth:
                parts.append((separator, current.strip()))
                current, separator, i = "", found, i + len(found)
                continue
            current, i = current + c, i + 1
        parts.append((separator, current.strip()))
        return [(s, p) for s, p in parts if p]

    @staticmethod
    def compound(parts: list[tuple[str, str]]) -> list[str]:
        """A loop, an if or a case is one command from its opening word to its closing one; the separators inside are put back."""
        joined, closers = [], []
        for separator, part in parts:
            words = part.split()
            if closers:
                joined[-1] += f"{separator} {part}"
            else:
                joined.append(part)
            if words and words[0] in OPENS:
                closers.append(OPENS[words[0]])
            if closers and words and closers[-1] in (words[0], words[-1]):
                closers.pop()
        return joined
