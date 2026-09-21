import re


LISTED = re.compile(r"^\s*(?:\(?[A-Za-z]\)|\(?[A-Za-z][.)]|\d+[.)]|[-*•])\s+\S", re.MULTILINE)
ASKING = re.compile(r"\?|\b(should I|shall I|do you want|would you like|would you prefer|which would you rather|let me know|your call|you decide|up to you"
                    r"|one thing I need from you|one question for you|the one decision|I would want your call|your pick)\b", re.IGNORECASE)
NAMED = re.compile(r"\bquestion \d+\b", re.IGNORECASE)


def offers_choices(text: str) -> bool:
    asked = "\n".join(line for line in text.splitlines() if not NAMED.search(line))
    return len(LISTED.findall(text)) >= 2 and bool(ASKING.search(asked))
