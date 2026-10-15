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
        chained = cls.chained(line)
        if not any(WRAPPED.match(p) for _, p in chained):
            return [Part(p, always=s != "&&") for s, p in chained]
        return [part for s, p in chained for part in cls.of(s, p)]

    @classmethod
    def of(cls, separator: str, part: str) -> list[Part]:
        wrapped = WRAPPED.match(part)
        if not wrapped:
            return [Part(part, recorded=False, always=separator != "&&")]
        inner = cls.chained(wrapped.group(1).replace(QUOTE, "'"))
        return [Part(p, always=(s or separator) != "&&") for s, p in inner]

    @classmethod
    def split(cls, line: str) -> list[str]:
        return [p for _, p in cls.chained(line)]

    @classmethod
    def chained(cls, line: str) -> list[tuple[str, str]]:
        """Each command with the separator before it: nothing for the first, && or ; after that."""
        return cls.compound(cls.simple(line))

    @staticmethod
    def simple(line: str) -> list[tuple[str, str]]:
        """Each command with the separator before it, split outside quotes, subshells, groups and comments; a heredoc takes the rest of the line whole."""
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
            if c in "\"'`":
                quote, current, i = c, current + c, i + 1
                continue
            if line.startswith("<<", i) and not line.startswith("<<<", i):
                return [(separator, (current + line[i:]).strip())] if not parts else parts + [(separator, (current + line[i:]).strip())]
            if c == "(" or (c == "{" and (line[i + 1:i + 2] in (" ", "\t") or line[i - 1:i] == "$")) or line.startswith("[[", i):
                depth += 1
            elif (c in ")}" or line.startswith("]]", i)) and depth:
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
    def compound(parts: list[tuple[str, str]]) -> list[tuple[str, str]]:
        """A loop, an if or a case is one command from its opening word to its closing one; the separators inside are put back."""
        joined, closers = [], []
        for separator, part in parts:
            words = part.split()
            if closers:
                joined[-1] = (joined[-1][0], f"{joined[-1][1]}{separator} {part}")
            else:
                joined.append((separator, part))
            if words and words[0] in OPENS:
                closers.append(OPENS[words[0]])
            if closers and words and closers[-1] in (words[0], words[-1]):
                closers.pop()
        return joined
