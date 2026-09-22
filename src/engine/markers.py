import re

MARKER = re.compile(r"\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]")


def marked(kind: str, value: str, text: str) -> str:
    return f"[[{kind} {value}|{text}]]"


def plain(text: str) -> str:
    return MARKER.sub(lambda found: found.group(3), text) if "[[" in text else text
