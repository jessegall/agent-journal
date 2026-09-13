#!/usr/bin/env python3
"""command.py: parsing, refusals, and write classification."""
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent
sys.path.insert(0, str(SRC))
from command import Arg, Command, Opt, Registry, number  # noqa: E402

ok = fail = 0


def check(label, got, want):
    global ok, fail
    if got == want:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL {label}\n       got  {got!r}\n       want {want!r}")


N = Arg("n", number("a question number"), what="a question number")


class QList(Command):
    noun, verb, default = "questions", "list", True


class QShow(Command):
    noun, verb, default, args = "questions", "show", True, (N,)


class QAdd(Command):
    noun, verb, writes = "questions", "add", True
    args, opts = (Arg("text", rest=True, what="the question"),), (Opt("about", repeat=True),)


class QAnswer(Command):
    noun, verb, writes = "questions", "answer", True
    args = (N, Arg("answer", rest=True, what="the answer"))


class QWithdraw(Command):
    noun, verb, verbs, writes = "questions", "withdraw", ("strike",), True
    args = (N, Arg("why", rest=True))


class TList(Command):
    noun = "todos"


class TShow(Command):
    noun, args = "todos", (Arg("n", number("a to-do number")),)


class TAdd(Command):
    noun, writes, args = "todos", True, (Arg("title", rest=True),)


class Next(Command):
    noun = "next"


reg = Registry(shared=(Opt("env"), Opt("all", bare=True), Opt("page", number("a page"), default=1)))
reg.noun("questions", "question")
reg.add(QList, QShow, QAdd, QAnswer, QWithdraw)
reg.noun("todos", "todo")
reg.add(TList, TShow, TAdd, Next)


def parse(*argv):
    return reg.parse(list(argv))


# ------------------------------------------------------------------ arguments by name
p, why = parse("questions", "answer", "3", "postgres", "for", "now")
check("a verb, a number, and the rest of the words",
      (why, type(p.command), p.arg("n"), p.arg("answer")), ("", QAnswer, 3, "postgres for now"))
check("the command object knows it writes", p.command.writes, True)

p, _ = parse("question", "add", "which", "db?", "--about=todo 22", "--about=doc 4.1")
check("an alias of the noun, a repeated option in order",
      (type(p.command), p.arg("text"), p.option("about")), (QAdd, "which db?", ["todo 22", "doc 4.1"]))

p, _ = parse("questions", "strike", "2", "not", "needed")
check("an alias of the verb", (type(p.command), p.arg("why")), (QWithdraw, "not needed"))

# ------------------------------------------------------------------ the bare noun: the arguments decide
check("bare noun lists", type(parse("questions")[0].command), QList)
check("`list` names the same command", type(parse("questions", "list")[0].command), QList)
p, _ = parse("questions", "7")
check("a bare number shows", (type(p.command), p.arg("n")), (QShow, 7))
p, _ = parse("todo", "park", "this")
check("a title files a to-do, and that is a write", (p.arg("title"), p.command.writes), ("park this", True))
p, _ = parse("todos", "3")
check("but a number reads one", (p.arg("n"), p.command.writes), (3, False))

# ------------------------------------------------------------------ options
p, _ = parse("questions", "--all", "--page=2")
check("shared options on any command, typed", (p.option("all"), p.option("page")), (True, 2))
p, _ = parse("questions")
check("defaults when absent", (p.option("all"), p.option("page"), p.option("env")), (None, 1, None))
p, why = parse("questions", "--bogus")
check("an unknown option is refused and names the command", (p, "unknown option '--bogus'" in why), (None, True))
p, why = parse("questions", "add", "x", "--all=yes")
check("a bare option given a value is refused", (p, why), (None, "'--all' takes no value"))
p, why = parse("questions", "add", "x", "--about")
check("a value option given none is refused", (p, why), (None, "'--about' wants a value: --about=<value>"))
p, why = parse("questions", "--page=two")
check("an option's type is enforced", (p, "a page must be a number" in why), (None, True))
p, why = parse("todos", "add", "--about=x")
check("an option another command declares is not accepted here", p, None)

# ------------------------------------------------------------------ refusals, from the declaration
p, why = parse("questions", "answer")
check("a missing argument names the usage and what it wants",
      why, "`journal questions answer <n> <answer>...` wants a question number")
p, why = parse("questions", "answer", "three", "x")
check("a wrong type says why", why,
      "`journal questions answer <n> <answer>...`: a question number must be a number, got 'three'")
p, why = parse("questions", "answer", "3")
check("the rest argument is required too", why, "`journal questions answer <n> <answer>...` wants the answer")
p, why = parse("questions", "show", "3", "extra")
check("leftover words are refused", why, "`journal questions show <n>` does not take 'extra'")
p, why = parse("nope")
check("an unknown noun", (p, why.startswith("no such command: 'nope'")), (None, True))
p, why = parse("next", "please")
check("a noun whose only command takes nothing", why, "`journal next` does not take 'please'")

# ------------------------------------------------------------------ `--` makes the rest payload
p, _ = parse("questions", "add", "--", "--about=is", "not", "an", "option")
check("after --, dashes are words", (p.arg("text"), p.option("about")), ("--about=is not an option", []))

# ------------------------------------------------------------------ the hook's question: does it write?
for words, want in ((["questions"], False), (["questions", "3"], False), (["questions", "show", "3"], False),
                    (["questions", "add", "x", "--about=todo 1"], True), (["questions", "answer"], True),
                    (["todo", "park", "this"], True), (["todos", "--all"], False), (["nope"], None)):
    cmd = reg.command_of(words)
    check(f"command_of {words}", None if cmd is None else cmd.writes, want)

# ------------------------------------------------------------------ usage and listing
class Usage(Command):
    noun, verb, args = "x", "y", (Arg("a"), Arg("b", optional=True), Arg("c", rest=True))


check("usage shows optional and rest arguments", Usage().usage(), "journal x y <a> [<b>] <c>...")
check("every command of a noun, by any spelling", len(reg.commands("question")), 5)
check("a command left without run() says so", isinstance(Next(), Command), True)
try:
    Next().run(None)
    check("the base run raises", False, True)
except NotImplementedError:
    check("the base run raises", True, True)

print(f"\n{ok} passed, {fail} failed")
raise SystemExit(1 if fail else 0)
