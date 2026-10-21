import re

HEADER = re.compile(r"^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+?)\s*$", re.M)


class PatchPaths:
    """The files a Codex apply_patch writes: every file its patch adds, changes, deletes or moves to, in the order the patch names them."""

    @staticmethod
    def build(input: dict) -> tuple[str, ...]:
        text = "\n".join(value for value in input.values() if isinstance(value, str))
        return tuple(dict.fromkeys(HEADER.findall(text)))
