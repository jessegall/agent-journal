import re

PATCH_ADDED = re.compile(r"^\+(?!\+\+)", re.M)
PATCH_REMOVED = re.compile(r"^-(?!--)", re.M)


class LineCount:
    """How many lines a file tool's input adds and removes, read from the text it carries: an edit's new and old text, a file's content, a patch's plus and minus lines."""

    @staticmethod
    def lines(text: object) -> int:
        return len(text.splitlines()) if isinstance(text, str) else 0

    @classmethod
    def edits(cls, edits: object) -> tuple[int, int]:
        rows = [edit for edit in edits if isinstance(edit, dict)] if isinstance(edits, list) else []
        return sum(cls.lines(edit.get("new_string")) for edit in rows), sum(cls.lines(edit.get("old_string")) for edit in rows)

    @staticmethod
    def patch(input: dict) -> tuple[int, int]:
        text = "\n".join(value for value in input.values() if isinstance(value, str))
        return len(PATCH_ADDED.findall(text)), len(PATCH_REMOVED.findall(text))
