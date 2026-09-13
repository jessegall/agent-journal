from __future__ import annotations

from command import Opt, number


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


SHARED = (Opt("env"), Opt("environment"), Opt("track"), Opt("as"))
LISTING = (Opt("all", bare=True), Opt("page", number("--page"), default=1), Opt("order", order, default="desc"))
