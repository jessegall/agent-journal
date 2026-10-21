import re

from journal.features.shell.support.part import Part

WRAPPED = re.compile(r"^eval '(.*)'(?: < /dev/null)?$", re.S)
QUOTE = "'\"'\"'"
OPENS = {"for": "done", "while": "done", "until": "done", "select": "done", "repeat": "done", "if": "fi", "case": "esac", "foreach": "end"}
BODIES = {"do", "then", "{"}
SHORT = {"for", "select", "repeat"}
BODY = {"for": "do", "while": "do", "until": "do", "select": "do", "repeat": "do", "if": "then", "case": "in"}
LEADS = {"do", "then", "else", "time", "!"}


COMPOUND = {"if", "elif", "else", "then", "for", "while", "until", "do", "case", "select", "{", "("}
HEREDOC_WORD = re.compile(r"<<-?\s*(['\"]?)(\w+)\1")


class Chain:
    """A shell line taken apart at its && and ; into the commands it chains, quotes, subshells, groups, loops and pipes respected: a pipe is one pipeline, not a chain."""

    @classmethod
    def parts(cls, line: str) -> list[Part]:
        chained = [(s, p, True) for s, p in cls.chained(line)]
        if any(WRAPPED.match(p) for _, p, _ in chained):
            chained = [inner for s, p, _ in chained for inner in cls.of(s, p)]
        following = [s for s, _, _ in chained[1:]] + [""]
        return [Part(p, recorded=r, always=s != "&&", guarded=f == "&&") for (s, p, r), f in zip(chained, following)]

    @classmethod
    def journal_parts(cls, line: str) -> tuple[int, int]:
        own = [p for p in cls.parts(line) if p.recorded]
        return len([p for p in own if cls.is_journal(p.text)]), len(own)

    @classmethod
    def own(cls, line: str) -> list[str]:
        return [part.text for part in cls.parts(line) if part.recorded]

    @classmethod
    def work_of(cls, line: str) -> str:
        own = [part for part in cls.parts(line) if part.recorded]
        if not own or not all(part.is_read() for part in own):
            return "running"
        return "searching" if any(part.is_search() for part in own) else "reading"

    @classmethod
    def is_journal_line(cls, line: str) -> bool:
        journal, parts = cls.journal_parts(line)
        return parts > 0 and journal == parts

    @classmethod
    def is_read_line(cls, line: str) -> bool:
        own = [p for p in cls.parts(line) if p.recorded]
        return bool(own) and all(p.is_read() for p in own)

    @classmethod
    def is_reading_code_line(cls, line: str) -> bool:
        own = [p for p in cls.parts(line) if p.recorded]
        return any(p.is_reading_code() for p in own) and all(p.is_reading_code() or p.is_harmless() or p.is_cd_into_project() for p in own)

    @staticmethod
    def is_journal(part: str) -> bool:
        text = part.split()
        return bool(text) and text[0].rsplit("/", 1)[-1] in ("journal", "journal.sh", "journal.py")

    @classmethod
    def of(cls, separator: str, part: str) -> list[tuple[str, str, bool]]:
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
        return cls.compound(cls.simple(line))

    @staticmethod
    def simple(line: str) -> list[tuple[str, str]]:
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
                    end = Chain.heredoc_end(line, i, current)
                    parts.append((separator, (current + line[i:end]).strip()))
                    current, separator, i = "", "", end
                    continue
                next_separator = "&&" if line.startswith("&&", i) else Chain.semicolon_at(line, i) or Chain.newline_at(line, i, current)
                if next_separator:
                    parts.append((separator, Chain.continued(current)))
                    current, separator, i = "", next_separator, i + len(next_separator)
                    continue
            current, i = current + c, i + 1
        parts.append((separator, Chain.continued(current)))
        return [(s, p) for s, p in parts if p]

    @staticmethod
    def heredoc_end(line: str, start: int, current: str) -> int:
        opening = HEREDOC_WORD.match(line, start)
        body_start = line.find("\n", start)
        compound = current.split()[:1] and current.split()[0] in COMPOUND
        if not opening or body_start < 0 or compound or "<<" in line[opening.end():body_start]:
            return len(line)
        word, position = opening.group(2), body_start + 1
        while position <= len(line):
            line_end = line.find("\n", position)
            line_end = len(line) if line_end < 0 else line_end
            if line[position:line_end].strip() == word:
                return line_end
            position = line_end + 1
        return len(line)

    @staticmethod
    def continued(part: str) -> str:
        part = part.strip()
        trailing = len(part) - len(part.rstrip("\\"))
        return part[:-1].rstrip() if trailing % 2 else part

    @staticmethod
    def semicolon_at(line: str, i: int) -> str:
        alone = line[i:i + 1] == ";" and line[i + 1:i + 2] not in (";", "&", "|") and line[i - 1:i] != ";"
        return ";" if alone else ""

    @staticmethod
    def newline_at(line: str, i: int, current: str) -> str:
        held = current.strip()
        ends = line[i:i + 1] == "\n" and held and not held.endswith(("|", "||", "|&")) and not held.startswith("#")
        return "\n" if ends else ""

    @staticmethod
    def segments(part: str) -> list[list[str]]:
        found: list[list[str]] = [[]]
        for word in Chain.uncommented(part).split():
            if word in ("|", "||", "|&", "&"):
                found.append([])
                continue
            found[-1].append(word)
        return [Chain.led(text) for text in found]

    @staticmethod
    def uncommented(part: str) -> str:
        return Part(part).command_text()

    @staticmethod
    def is_opening(text: list[str]) -> bool:
        if not text or text[0] not in OPENS:
            return False
        closer, body = OPENS[text[0]], BODY.get(text[0])
        if body is None:
            return closer not in text[1:]
        return not (body in text and closer in [w.rstrip(");`") for w in text[text.index(body) + 1:]])

    @staticmethod
    def openings(segments: list[list[str]]) -> list[list[str]]:
        ends = [segments[0]] if len(segments) == 1 else [segments[0], segments[-1]]
        return [text for text in ends if Chain.is_opening(text)]

    @staticmethod
    def closes(part: str, segments: list[list[str]], closer: str) -> bool:
        text = part.split()
        after_arm = closer == "esac" and any(w == "esac" and text[i - 1].endswith((";;", ";&", ";|")) for i, w in enumerate(text) if i)
        return segments[0][:1] == [closer] or segments[-1][:1] == [closer] or after_arm

    @staticmethod
    def rejoined(joined: str, separator: str, part: str) -> str:
        return {";": f"{joined}; {part}", "\n": f"{joined}\n{part}"}.get(separator, f"{joined} {separator} {part}")

    @staticmethod
    def led(text: list[str]) -> list[str]:
        start = next((i for i, w in enumerate(text) if w not in LEADS), len(text))
        return text[start:]

    @staticmethod
    def compound(parts: list[tuple[str, str]]) -> list[tuple[str, str]]:
        joined, closers, short = [], [], False
        for separator, part in parts:
            segments, text = Chain.segments(part), part.split()
            if short and separator != "&&":
                closers.pop()
                short = False
            if closers:
                opener = joined[-1][1].split()[0]
                joined[-1] = (joined[-1][0], Chain.rejoined(joined[-1][1], separator, part))
                if len(closers) == 1 and not short and separator == ";" and opener in SHORT and text and text[0] not in BODIES | {closers[-1]} and not any(w in BODIES for w in joined[-1][1].split()):
                    short = True
            else:
                joined.append((separator, part))
            if closers and not short and Chain.closes(part, segments, closers[-1]):
                closers.pop()
            for opening in [] if short else Chain.openings(segments):
                closers.append(OPENS[opening[0]])
                short = opening[0] == "repeat" and len(opening) > 2 and opening[2] != "do"
        return joined
