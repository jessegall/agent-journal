#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from templates import render  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


T = "question {n}[, about {about}] ({open} open)"
check("placeholders fill", render(T, n=3, about=["to-do 1", "pin 2"], open=2),
      "question 3, about to-do 1, pin 2 (2 open)")
check("an optional segment with an empty value is dropped", render(T, n=3, about=[], open=1),
      "question 3 (1 open)")
check("zero is a value, not empty", render("{open} open", open=0), "0 open")
check("None and empty strings drop a segment", (render("a[ b{x}]", x=None), render("a[ b{x}]", x="")), ("a", "a"))
check("a join separator", render("{xs: · }", xs=["a", "b", "c"]), "a · b · c")
check("several optional segments independently", render("[{a}][-{b}][+{c}]", a="1", b="", c="3"), "1+3")
check("literal brackets and braces", render("\\[{x}\\] {{literal}}", x="y"), "[y] {literal}")
try:
    render("{missing}")
    check("a missing placeholder raises", False, True)
except KeyError as e:
    check("a missing placeholder raises and names it", "missing" in str(e), True)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
