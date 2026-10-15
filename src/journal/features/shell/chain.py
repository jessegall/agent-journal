import re

from journal.features.shell.part import Part

WRAPPED = re.compile(r"^eval '(.*)' < /dev/null$", re.S)
"""Claude Code runs the agent's command as eval '<command>' < /dev/null between its own set-up and a pwd: the command inside is what the agent wrote."""
QUOTE = "'\"'\"'"


class Chain:
    """A shell line taken apart at its && and ; into the commands it chains, quotes, subshells, groups and pipes respected: a pipe is one pipeline, not a chain."""

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

    @staticmethod
    def split(line: str) -> list[str]:
        parts, current, quote, depth, i = [], "", "", 0, 0
        while i < len(line):
            c = line[i]
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
            separator = "&&" if line.startswith("&&", i) else ";" if c == ";" and not line.startswith(";;", i) else ""
            if separator and not depth:
                parts.append(current.strip())
                current, i = "", i + len(separator)
                continue
            current, i = current + c, i + 1
        parts.append(current.strip())
        return [p for p in parts if p]
