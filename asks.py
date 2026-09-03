"""Does this prompt ask for work? The question the to-do rule turns on.

THE RULE IS ONLY AS GOOD AS THIS DETECTOR. "When the user asks for something you are not
working on and it can wait, park it" needs the hook to know that the user asked for
something — otherwise the reminder rides on every prompt and becomes wallpaper, or the
deferral gate fires on an agent describing the order of its own work. So the prompt is
read for the shapes a request takes, and read against the shapes a question, an answer, or
an acknowledgement takes.

BIASED TOWARDS THE REQUEST. A missed request costs one unparked to-do; a false positive
costs one line of context the agent reads past. Both are cheap, but the whole reason this
exists is the missed one, so a clause that could go either way counts as work.

Measured against this project's own prompts, which are the test cases in `test_gate.py`:
"Lets rename the Nothing component to Empty ? or None? Suggestions?" is a request;
"are rules correctly injected on start too?!" is not; "nah, its fine" is not.
"""
from __future__ import annotations

import re

#: Verbs that name work when they lead a clause. Imperatives, mostly; a few that are work
#: in this trade whatever their mood ("investigate", "look into").
WORK_VERBS = frozenset("""
add remove delete drop rename replace rewrite refactor restructure reorganise reorganize
fix repair patch resolve handle support allow enable disable implement build create make
write generate introduce extract split merge move migrate port convert change update bump
upgrade downgrade improve optimise optimize speed clean tidy simplify document test cover
wire hook set setup configure install uninstall deploy ship release publish sync
investigate debug diagnose look figure find check verify confirm ensure
run rerun retry restart revert undo redo apply commit push pull format lint
show list print display expose hide increase decrease raise lower limit cap
park promote strike pin remember switch teach explain
nudge remind notify warn block deny refuse gate inject trigger load unload hide expose
environment log record store save read parse detect measure count dedupe deduplicate
""".split())

#: What precedes the verb in a request, stripped so the verb can lead. Order matters
#: only in that longer openers are tried first.
_OPENERS = [
    "can you please", "could you please", "would you please", "please can you",
    "can you", "could you", "would you", "will you", "can we", "could we", "should we",
    "shall we", "let's", "lets", "let us", "i want you to", "i'd like you to",
    "i would like you to", "i need you to", "i want to", "i'd like to", "i would like to",
    "we should", "we need to", "we must", "you should", "you need to", "you must",
    "it would be nice to", "it would be good to", "it'd be nice to", "it'd be good to",
    "make sure to", "make sure you", "make sure we", "be sure to", "don't forget to",
    "dont forget to", "remember to", "try to", "go ahead and", "just", "please", "also",
    "and", "then", "next", "now", "so", "oh", "hey", "btw", "by the way", "after that",
    "when you're done", "when youre done", "when done", "one more thing", "additionally",
    "on top of that", "i think we should", "i think you should", "maybe", "perhaps",
    "ideally", "if possible", "if you can", "at some point", "later", "afterwards",
    "first", "before that", "quickly", "real quick", "you can", "you could", "you may",
    "feel free to", "yea but", "yeah but", "ok but", "okay but", "but",
]

#: An ack, a yes, a no, a thanks: never a request, whatever else it looks like.
_ACKS = frozenset("""
ok okay k kk cool nice great perfect good fine yes yep yeah yup sure no nope nah thanks
thank thx ty cheers right correct exactly indeed agreed go ahead proceed continue
""".split())

#: A clause that leads with one of these is asking, not asking for work — unless an
#: opener above rewrites it ("can you fix" survives; "can it fix" does not).
_QUESTION_LEADS = frozenset("""
what why how where which who whom whose when is are was were does do did has have had
will would could should can may might am isn't aren't doesn't don't didn't
""".split())

#: A report of something wrong is a request to put it right.
_BROKEN = re.compile(
    r"\b(?:is|are|isn't|aren't|was|were|still|now)\s+(?:not\s+)?(?:working|broken|failing|wrong|missing|incorrect|off|misaligned|slow|empty)\b"
    r"|\b(?:doesn't|does not|don't|do not|won't|will not|can't|cannot|couldn't|didn't|did not)\s+(?:work|load|render|compile|build|run|save|open|start|show|update|fire|trigger|respond|match|pass)\b"
    r"|\b(?:throws?|throwing|threw|crash(?:es|ed|ing)?|fails?|failing|failed|errors?|exceptions?|500s?|404s?|bugs?|regression|broke|breaks|got blocked|is blocked|hangs?|hanging|stuck|leaks?)\b"
    r"|\b(?:should have|shouldn't have|should not have|wasn't supposed to|was not supposed to|forgot to|never)\b"
    r"|\b(?:duplicated?|duplicates|twice|double|out of date|outdated|stale|typo|misspelt|misspelled)\b",
    re.I,
)

#: "it should …", "the output must …", "X needs to …": a requirement, which is work.
_REQUIREMENT = re.compile(
    r"\b(?:it|this|that|they|these|those|the \w+(?: \w+)?|every \w+|each \w+|we|you|claude|the agent|subagents?|"
    r"rules?|pins?|to-?dos?|hooks?|outputs?|commands?|skills?)\s+"
    r"(?:should|must|needs? to|has to|have to|ought to|shouldn't|should not|mustn't|must not)\b",
    re.I,
)

#: A design question that names an action: "rename X to Y?", "or None? Suggestions?"
_ACTION_NOUN = re.compile(r"\b(?:suggestions?|proposals?|options?|ideas?)\s*\??\s*$", re.I)

_SPLIT = re.compile(r"[.!?;,\n]+|\s+-{1,2}\s+|\s+—\s+|\s*\|\s*")
_WORD = re.compile(r"[a-z0-9'’\-]+")


def _words(text: str) -> list[str]:
    return _WORD.findall(text.lower().replace("’", "'"))


def _lead_verb(words: list[str]) -> bool:
    """After the openers and the acks are stripped, does a work verb lead?"""
    changed = True
    while changed and words:
        changed = False
        if words[0] in _ACKS:
            words = words[1:]
            changed = True
            continue
        for op in sorted(_OPENERS, key=len, reverse=True):
            n = len(op.split())
            if words[:n] == op.split():
                words = words[n:]
                changed = True
                break
    if not words:
        return False
    head = words[0]
    if head in WORK_VERBS:
        return True
    # "renaming", "renamed", "runs" — the verb in another form; and "createa", a verb with
    # a typo's tail, because a request mistyped is still a request
    for v in WORK_VERBS:
        if head in (v + "s", v + "ing", v + "d", v + "ed") or (v.endswith("e") and head == v[:-1] + "ing"):
            return True
        if len(v) >= 4 and head.startswith(v) and len(head) - len(v) <= 2:
            return True
    return False


def asks_for_work(text: str) -> bool:
    """Is there a request for work anywhere in this prompt?"""
    text = (text or "").strip()
    if not text:
        return False
    all_words = _words(text)
    if len(all_words) <= 3 and all(w in _ACKS for w in all_words):
        return False
    for clause in _SPLIT.split(text):
        words = _words(clause)
        if not words:
            continue
        if all(w in _ACKS for w in words):
            continue
        if _lead_verb(list(words)):
            return True
        if _BROKEN.search(clause) or _REQUIREMENT.search(clause):
            return True
        # a question that still names the action: "should we rename X?" (opener strips
        # to "rename"), "rename it to Empty? or None?" — but not "why did we rename it?"
        if words[0] in _QUESTION_LEADS:
            continue
        if _ACTION_NOUN.search(clause) and any(w in WORK_VERBS for w in words):
            return True
    return False
