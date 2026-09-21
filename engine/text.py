import inspect


def paragraphs(text: str) -> str:
    return "\n\n".join(" ".join(line.strip() for line in part.splitlines()) for part in inspect.cleandoc(text).split("\n\n") if part.strip())
