import hashlib
import inspect
import re

SLUG = re.compile(r"[^a-z0-9]+")


def noun(n: int, word: str) -> str:
    return f"{word}{'s' if n != 1 else ''}"


def plural(n: int, word: str) -> str:
    return f"{n} {noun(n, word)}"


def digest(text: str | bytes, length: int = 40) -> str:
    return hashlib.sha1(text if isinstance(text, bytes) else text.encode()).hexdigest()[:length]


def clipped(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"


def slugged(name: str, sep: str = "-", limit: int = 0) -> str:
    slug = SLUG.sub(sep, name.lower()).strip(sep)
    return slug[:limit].strip(sep) if limit else slug


def paragraphs(text: str) -> str:
    return "\n\n".join(" ".join(line.strip() for line in part.splitlines()) for part in inspect.cleandoc(text).split("\n\n") if part.strip())
