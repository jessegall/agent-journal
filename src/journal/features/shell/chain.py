import re

from journal.features.shell.part import Part

WRAPPED = re.compile(r"^eval '(.*)' < /dev/null$", re.S)
"""Claude Code runs the agent's command as eval '<command>' < /dev/null between its own set-up and a pwd: the command inside is what the agent wrote."""
QUOTE = "'\"'\"'"
OPENS = {"for": "done", "while": "done", "until": "done", "select": "done", "repeat": "done", "if": "fi", "case": "esac", "foreach": "end"}
"""A compound command runs from its opening word to its closing one, whatever separators lie between."""
BODIES = {"do", "then", "{"}
"""The word that opens a compound command's body in the long form; without it zsh takes the next command, with its && chain, as the body."""
SHORT = {"for", "select", "repeat"}
"""The openers zsh allows in that short form; an if, a while or an until reads on to its then or do."""


class Chain:
    """A shell line taken apart at its && and ; into the commands it chains, quotes, subshells, groups, loops and pipes respected: a pipe is one pipeline, not a chain."""

    @classmethod
    def parts(cls, line: str) -> list[Part]:
        """The chain's commands in order: the agent's own recorded, the shell's wrapping around them silent."""
        chained = [(s, p, True) for s, p in cls.chained(line)]
        if any(WRAPPED.match(p) for _, p, _ in chained):
            chained = [inner for s, p, _ in chained for inner in cls.of(s, p)]
        following = [s for s, _, _ in chained[1:]] + [""]
        return [Part(p, recorded=r, always=s != "&&", guarded=f == "&&") for (s, p, r), f in zip(chained, following)]

    @classmethod
    def of(cls, separator: str, part: str) -> list[tuple[str, str, bool]]:
        """A wrapped part becomes the agent's own commands inside it; any other stays the shell's, in silence."""
        wrapped = WRAPPED.match(part)
        if not wrapped:
            return [(separator, part, False)]
        inner = cls.chained(wrapped.group(1).replace(QUOTE, "'"))
        return [(s or separator, p, True) for s, p in inner]

    @classmethod
    def split(cls, line: str) -> list[str]:
        return [p for _, p in cls.chained(line)]

    @classmethod
    def chained(cls, line: str) -> list[tuple[str, str]]:
        """Each command with the separator before it: nothing for the first, && or ; after that."""
        return cls.compound(cls.simple(line))

    @staticmethod
    def simple(line: str) -> list[tuple[str, str]]:
        """Each command with the separator before it, split only at the top level: quotes, substitutions, subshells, groups, brackets and comments nest on a stack, and a heredoc takes the rest of the line whole."""
        parts, current, stack, separator, i = [], "", [], "", 0
        while i < len(line):
            c, inner = line[i], stack[-1] if stack else ""
            if c == "\\" and inner != "'" and i + 1 < len(line):
                current, i = current + line[i:i + 2], i + 2
                continue
            if inner in ("'", "`"):
                stack.pop() if c == inner else None
            elif inner == '"':
                if c == '"':
                    stack.pop()
                elif line.startswith("$(", i):
                    stack.append("(")
                    current, i = current + "$(", i + 2
                    continue
            elif c in "\"'`":
                stack.append(c)
            elif line.startswith("[[", i) and not stack:
                stack.append("[")
                current, i = current + "[[", i + 2
                continue
            elif inner == "[" and line.startswith("]]", i):
                stack.pop()
                current, i = current + "]]", i + 2
                continue
            elif c == "(" or (c == "{" and (line[i + 1:i + 2] in (" ", "\t") or line[i - 1:i] == "$")):
                stack.append(c)
            elif c == ")" and inner == "(" or c == "}" and inner == "{":
                stack.pop()
            elif not stack:
                if c == "#" and (i == 0 or line[i - 1] in " \t\n"):
                    end = line.find("\n", i)
                    end = len(line) if end < 0 else end
                    current, i = current + line[i:end], end
                    continue
                if line.startswith("<<", i) and not line.startswith("<<<", i):
                    parts.append((separator, (current + line[i:]).strip()))
                    return [(s, p) for s, p in parts if p]
                found = "&&" if line.startswith("&&", i) else ";" if c == ";" and line[i + 1:i + 2] not in (";", "&", "|") and line[i - 1:i] != ";" else ""
                if found:
                    parts.append((separator, current.strip()))
                    current, separator, i = "", found, i + len(found)
                    continue
            current, i = current + c, i + 1
        parts.append((separator, current.strip()))
        return [(s, p) for s, p in parts if p]

    @staticmethod
    def command_words(part: str) -> list[str]:
        """The part's words from its last command position: the start, or the word after a pipe, where a keyword counts."""
        words = part.split()
        starts = [i + 1 for i, w in enumerate(words) if w in ("|", "|&")]
        return words[starts[-1]:] if starts and starts[-1] < len(words) and words[starts[-1]] in OPENS else words

    @staticmethod
    def compound(parts: list[tuple[str, str]]) -> list[tuple[str, str]]:
        """A loop, an if or a case is one command from its opening word to its closing one, or in zsh's short form to the end of the next command's && chain; the separators inside are put back."""
        joined, closers, short = [], [], False
        for separator, part in parts:
            words = Chain.command_words(part)
            if short and separator != "&&":
                closers.pop()
                short = False
            if closers:
                opener = joined[-1][1].split()[0]
                joined[-1] = (joined[-1][0], f"{joined[-1][1]}{separator if separator == ';' else ' ' + separator} {part}")
                if len(closers) == 1 and not short and separator == ";" and opener in SHORT and words and words[0] not in BODIES | {closers[-1]} and not any(w in BODIES for w in joined[-1][1].split()):
                    short = True
            else:
                joined.append((separator, part))
            if words and words[0] in OPENS and not short and OPENS[words[0]] not in words[1:]:
                closers.append(OPENS[words[0]])
                short = words[0] == "repeat" and len(words) > 2
            elif closers and words and words[0] == closers[-1] and not short:
                closers.pop()
        return joined
