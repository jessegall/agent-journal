import re


LISTED = re.compile(r"^\s*(?:\(?[A-Za-z]\)|\(?[A-Za-z][.)]|\d+[.)]|[-*•])\s+\S", re.MULTILINE)
ASKING = re.compile(r"\?|\b(should I|shall I|do you want|would you like|would you prefer|which would you rather|let me know|your call|you decide|up to you"
                    r"|one thing I need from you|one question for you|the one decision|I would want your call|your pick)\b", re.IGNORECASE)
NAMED = re.compile(r"\bquestions? (\d+)(?:\s*(?:-|–|to)\s*(\d+))?", re.IGNORECASE)
LEADING = re.compile(r"^\s*(?:[-*•]\s*)?\**(\d+)\b")
QUOTED = re.compile(r"`[^`\n]*`|\"[^\"\n]*\"|“[^”\n]*”")
OPTION = 80


def named_numbers(text: str) -> set[int]:
    found = set()
    for first, last in NAMED.findall(text):
        found |= set(range(int(first), int(last or first) + 1)) if int(last or first) - int(first) < 50 else {int(first)}
    return found


def points_at_named(line: str, named: set[int]) -> bool:
    found = LEADING.match(line)
    return bool(NAMED.search(line)) or bool(found and int(found.group(1)) in named)


def offers_choices(text: str) -> bool:
    named = named_numbers(text)
    paragraphs = [part for part in re.split(r"\n\s*\n", QUOTED.sub("", text)) if part.strip()]
    for at, paragraph in enumerate(paragraphs):
        options = [line for line in paragraph.splitlines() if LISTED.match(line) and len(line.strip()) <= OPTION]
        if len(options) < 2:
            continue
        around = "\n".join(paragraphs[max(0, at - 1):at + 2]).splitlines()
        if any(ASKING.search(line) for line in around if not LISTED.match(line) and not points_at_named(line, named)):
            return True
    return False


RESTATED = re.compile(r"^\s*(?:\(?[A-Za-z]\)|[A-Za-z][.):]|\d+[.):]|option \w+[.):]?)\s+\S", re.MULTILINE | re.IGNORECASE)


BULLET = re.compile(r"^\s*(?:[-*•]\s+|\*\*)?")


def restates(text: str, titles: list[str]) -> bool:
    if len(titles) < 2:
        return False
    starts = [BULLET.sub("", line).lower() for line in text.splitlines()]
    listed = sum(1 for title in titles if title and any(line.startswith(title.lower()) for line in starts))
    return len(RESTATED.findall(text)) >= len(titles) or listed == len(titles)
