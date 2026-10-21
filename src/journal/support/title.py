from journal.support.rejection import Rejection

LONGEST = 80


class Title:
    """A row's title: one line of at most eighty characters, with no colon. The longer story goes in the brief."""

    @staticmethod
    def check(text: str) -> None:
        if len(text) > LONGEST:
            raise Rejection(f"a title is at most {LONGEST} characters, this one is {len(text)}: put the rest in the brief")
        if ":" in text:
            raise Rejection("a title holds no colon: say it in one line and put the rest in the brief")

    @classmethod
    def check_target(cls, row, was=None) -> None:
        title = getattr(row, "title", None)
        if isinstance(title, str) and (was is None or title != getattr(was, "title", None)):
            cls.check(title)
