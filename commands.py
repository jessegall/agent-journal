from __future__ import annotations

from cli import Arg, Command, Opt, Registry, number


def order(value: str) -> str:
    value = value.strip().lower()
    if value not in ("asc", "desc"):
        raise ValueError(f"--order wants asc or desc, got {value!r}. Newest first is the "
                         "default; --order=asc reads oldest first.")
    return value


SHARED = (Opt("env"), Opt("environment"), Opt("track"), Opt("as"))
LISTING = (Opt("all", bare=True), Opt("page", number("--page"), default=1), Opt("order", order, default="desc"))

REGISTRY = Registry(shared=SHARED)

_QUESTION = Arg("n", number("a question number"), what="a question number")
_REF = Arg("ref", rest=True, what="a reference like `todo 22` or `doc 4.1`")

REGISTRY.noun("questions", "question")
for cmd in (
    Command("questions", name="questions.list", opts=LISTING),
    Command("questions", name="questions.show", args=(_QUESTION,)),
    Command("questions", "list", name="questions.list", opts=LISTING),
    Command("questions", "show", name="questions.show", args=(_QUESTION,)),
    Command("questions", "add", name="questions.add", writes=True,
            args=(Arg("text", rest=True, what="the question"),), opts=(Opt("about", repeat=True),)),
    Command("questions", "answer", name="questions.answer", writes=True,
            args=(_QUESTION, Arg("answer", rest=True, what="the answer"))),
    Command("questions", "link", name="questions.link", writes=True, args=(_QUESTION, _REF)),
    Command("questions", "unlink", name="questions.unlink", writes=True, args=(_QUESTION, _REF)),
    Command("questions", "withdraw", name="questions.withdraw", writes=True, verbs=("strike",),
            args=(_QUESTION, Arg("why", rest=True, what="why it no longer needs an answer"))),
):
    REGISTRY.add(cmd)
