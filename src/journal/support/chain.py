import re

from journal.features.shell.support.part import Part

WRAPPED = re.compile(r"^eval '(.*)'(?: < /dev/null)?$", re.S)
"""Claude Code runs the agent's command as eval '<command>' < /dev/null between its own set-up and a pwd, without the < /dev/null when the command has a heredoc: the command inside is what the agent wrote."""
QUOTE = "'\"'\"'"
OPENS = {"for": "done", "while": "done", "until": "done", "select": "done", "repeat": "done", "if": "fi", "case": "esac", "foreach": "end"}
"""A compound command runs from its opening word to its closing one, whatever separators lie between."""
BODIES = {"do", "then", "{"}
"""The word that opens a compound command's body in the long form; without it zsh takes the next command, with its && chain, as the body."""
SHORT = {"for", "select", "repeat"}
"""The openers zsh allows in that short form; an if, a while or an until reads on to its then or do."""
BODY = {"for": "do", "while": "do", "until": "do", "select": "do", "repeat": "do", "if": "then", "case": "in"}
"""The word each opener's body follows; its closer after that word closes it on the same line."""
LEADS = {"do", "then", "else", "time", "!"}
"""Words that may stand before a command's own first word, so a loop opened right after do or then, or timed, is still seen opening."""


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
    def journal_parts(cls, line: str) -> tuple[int, int]:
        """How many of the agent's own parts are journal commands, and how many parts there are."""
        own = [p for p in cls.parts(line) if p.recorded]
        return len([p for p in own if cls.is_journal(p.text)]), len(own)

    @classmethod
    def own(cls, line: str) -> list[str]:
        """The agent's own commands of the line, the shell's wrapping left out: the same for the line the runner is handed as for the one the tool was called with."""
        return [part.text for part in cls.parts(line) if part.recorded]

    @classmethod
    def is_journal_line(cls, line: str) -> bool:
        """A line of journal commands alone: its answer reaches the agent whole, at once, and is no output of its own."""
        journal, parts = cls.journal_parts(line)
        return parts > 0 and journal == parts

    @classmethod
    def is_read_line(cls, line: str) -> bool:
        """A line whose own commands all read on purpose."""
        own = [p for p in cls.parts(line) if p.recorded]
        return bool(own) and all(p.is_read() for p in own)

    @staticmethod
    def is_journal(part: str) -> bool:
        words = part.split()
        return bool(words) and words[0].rsplit("/", 1)[-1] in ("journal", "journal.sh", "journal.py")

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
                if c == inner:
                    stack.pop()
            elif inner == "$'":
                if c == "'":
                    stack.pop()
            elif inner == '"':
                if c == '"':
                    stack.pop()
                elif line.startswith("$(", i):
                    stack.append("(")
                    current, i = current + "$(", i + 2
                    continue
            elif c == "'" and line[i - 1:i] == "$":
                stack.append("$'")
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
            elif c == "(" or (c == "{" and (line[i + 1:i + 2] in (" ", "\t", "\n") or line[i - 1:i] == "$")):
                stack.append(c)
            elif c == ")" and inner == "(" or c == "}" and inner == "{":
                stack.pop()
            elif not stack:
                if c == "#" and (i == 0 or line[i - 1] in " \t\n;&|"):
                    end = line.find("\n", i)
                    end = len(line) if end < 0 else end
                    current, i = current + line[i:end], end
                    continue
                if line.startswith("<<", i) and not line.startswith("<<<", i) and line[i - 1:i] != "<":
                    parts.append((separator, (current + line[i:]).strip()))
                    return [(s, p) for s, p in parts if p]
                found = "&&" if line.startswith("&&", i) else Chain.semicolon_at(line, i) or Chain.newline_at(line, i, current)
                if found:
                    parts.append((separator, Chain.continued(current)))
                    current, separator, i = "", found, i + len(found)
                    continue
            current, i = current + c, i + 1
        parts.append((separator, Chain.continued(current)))
        return [(s, p) for s, p in parts if p]

    @staticmethod
    def continued(part: str) -> str:
        """The part without a trailing backslash that only carried it onto the next line, before the separator."""
        part = part.strip()
        trailing = len(part) - len(part.rstrip("\\"))
        return part[:-1].rstrip() if trailing % 2 else part

    @staticmethod
    def semicolon_at(line: str, i: int) -> str:
        """A lone ; at the position, which ends a command; ;; ;& and ;| belong to a case."""
        alone = line[i:i + 1] == ";" and line[i + 1:i + 2] not in (";", "&", "|") and line[i - 1:i] != ";"
        return ";" if alone else ""

    @staticmethod
    def newline_at(line: str, i: int, current: str) -> str:
        """A newline that ends a command: not one after a pipe or an ||, which carries the command on, nor one that ends a comment line, kept with the command below it."""
        held = current.strip()
        ends = line[i:i + 1] == "\n" and held and not held.endswith(("|", "||", "|&")) and not held.startswith("#")
        return "\n" if ends else ""

    @staticmethod
    def segments(part: str) -> list[list[str]]:
        """The part's commands as words, split where a pipe, an || or a lone & starts the next, each from its own first word."""
        found: list[list[str]] = [[]]
        for word in Chain.uncommented(part).split():
            if word in ("|", "||", "|&", "&"):
                found.append([])
                continue
            found[-1].append(word)
        return [Chain.led(words) for words in found]

    @staticmethod
    def uncommented(part: str) -> str:
        """The part from its first line that is not a comment."""
        lines = part.split("\n")
        return "\n".join(lines[next((i for i, line in enumerate(lines) if not line.lstrip().startswith("#")), len(lines)):])

    @staticmethod
    def is_opening(words: list[str]) -> bool:
        """The command opens a loop, an if or a case that it does not also close."""
        if not words or words[0] not in OPENS:
            return False
        closer, body = OPENS[words[0]], BODY.get(words[0])
        if body is None:
            return closer not in words[1:]
        return not (body in words and closer in [w.rstrip(");`") for w in words[words.index(body) + 1:]])

    @staticmethod
    def openings(segments: list[list[str]]) -> list[list[str]]:
        """The part's first and last commands that open a loop, an if or a case: one before an ||, or one after a pipe."""
        ends = [segments[0]] if len(segments) == 1 else [segments[0], segments[-1]]
        return [words for words in ends if Chain.is_opening(words)]

    @staticmethod
    def closes(part: str, segments: list[list[str]], closer: str) -> bool:
        """The part ends what is open: its first or last command is the closing word, or an esac follows a case arm's ;;."""
        words = part.split()
        after_arm = closer == "esac" and any(w == "esac" and words[i - 1].endswith((";;", ";&", ";|")) for i, w in enumerate(words) if i)
        return segments[0][:1] == [closer] or segments[-1][:1] == [closer] or after_arm

    @staticmethod
    def rejoined(joined: str, separator: str, part: str) -> str:
        return {";": f"{joined}; {part}", "\n": f"{joined}\n{part}"}.get(separator, f"{joined} {separator} {part}")

    @staticmethod
    def led(words: list[str]) -> list[str]:
        """The words from the command's own first word, past a do, then, else, time or ! before it."""
        start = next((i for i, w in enumerate(words) if w not in LEADS), len(words))
        return words[start:]

    @staticmethod
    def compound(parts: list[tuple[str, str]]) -> list[tuple[str, str]]:
        """A loop, an if or a case is one command from its opening word to its closing one, or in zsh's short form to the end of the next command's && chain; the separators inside are put back."""
        joined, closers, short = [], [], False
        for separator, part in parts:
            segments, words = Chain.segments(part), part.split()
            if short and separator != "&&":
                closers.pop()
                short = False
            if closers:
                opener = joined[-1][1].split()[0]
                joined[-1] = (joined[-1][0], Chain.rejoined(joined[-1][1], separator, part))
                if len(closers) == 1 and not short and separator == ";" and opener in SHORT and words and words[0] not in BODIES | {closers[-1]} and not any(w in BODIES for w in joined[-1][1].split()):
                    short = True
            else:
                joined.append((separator, part))
            if closers and not short and Chain.closes(part, segments, closers[-1]):
                closers.pop()
            for opening in [] if short else Chain.openings(segments):
                closers.append(OPENS[opening[0]])
                short = opening[0] == "repeat" and len(opening) > 2 and opening[2] != "do"
        return joined
