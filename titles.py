from templates import render

#: A TITLE IS A NAME, NOT AN EXPLANATION (rule 13, message 165). The longest a plan, a piece of
#: work, a to-do or a report may be called; what it means goes in the brief.
MAX = 80

MESSAGES = {
    "too_long": "a {kind} title is at most {max} characters; this one is {n}. Say what it is in the title and the rest in the brief",
    "colon": "a {kind} title does not explain itself with a colon — name the thing, and put the explanation in the brief",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def check(title: str, kind: str) -> tuple[bool, str]:
    flat = " ".join((title or "").split())
    if len(flat) > MAX:
        return False, say("too_long", kind=kind, max=MAX, n=len(flat))
    if ":" in flat:
        return False, say("colon", kind=kind)
    return True, ""
