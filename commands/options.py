from __future__ import annotations

from command import number, options
from templates import render

REFUSALS = {
    "order": "--order wants asc or desc, got {value}. Newest first is the default; --order=asc reads oldest first.",
    "bare_number": "{what} is not a bare number, got {text}",
}


def order(value: str) -> str:
    value = value.strip().lower()
    if value not in ("asc", "desc"):
        raise ValueError(render(REFUSALS["order"], value=repr(value)))
    return value


def words(what: str):
    def convert(text: str) -> str:
        if text.strip().isdigit():
            raise ValueError(render(REFUSALS["bare_number"], what=what, text=repr(text)))
        return text
    return convert


SHARED = options("{--env=} {--environment=} {--track=} {--as=}")
LISTING = "{--all} {--page=1} {--order=desc}"
LISTING_CASTS = {"page": number("--page"), "order": order}
