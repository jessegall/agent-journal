import re

FRONTMATTER = re.compile(r"\A---\n(.*?)\n---\n", re.S)


def frontmatter(text: str) -> dict:
    front = FRONTMATTER.match(text)
    return dict(re.findall(r"^(\w+):\s*(.*)$", front.group(1), re.M)) if front else {}
