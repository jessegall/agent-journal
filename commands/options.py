from __future__ import annotations

from command import number, options


def order(value: str) -> str:
    value = value.strip().lower()
    if value not in ("asc", "desc"):
        raise ValueError(f"--order wants asc or desc, got {value!r}. Newest first is the "
                         "default; --order=asc reads oldest first.")
    return value


def words(what: str):
    def convert(text: str) -> str:
        if text.strip().isdigit():
            raise ValueError(f"{what} is not a bare number, got {text!r}")
        return text
    return convert


SHARED = options("{--env=} {--environment=} {--track=} {--as=}")
LISTING = "{--all} {--page=1} {--order=desc}"
LISTING_CASTS = {"page": number("--page"), "order": order}
