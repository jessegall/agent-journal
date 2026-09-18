from __future__ import annotations

import re

# THE TAG OPENS THE MESSAGE. Not a line — the message, before anything else but whitespace.
#
# An earlier version matched the start of ANY line, so that an agent which answered first
# and declared below had still declared. That is friendlier and it is wrong: the moment a
# message EXPLAINS the vocabulary — a nudge quoted back, a page documenting the tags, this
# very comment — every listed tag matches and the message files itself as something it was
# only ever talking about. A record that cannot tell using a word from mentioning one will
# fill with entries nobody wrote.
#
# So: talking about a tag is not using one, and the only way to use one is to lead with it.
PATTERN = re.compile(r"\A\s*\[!([a-z]+)\]")


class Tag:

    __slots__ = ("name", "line")

    def __init__(self, name: str, line: str):
        self.name = name
        self.line = line   # what it is for, shown by `journal instructions`

    def __repr__(self) -> str:
        return f"Tag({self.name!r})"


TAGS = {
    t.name: t
    for t in (
        Tag("discovery", "the real shape of something you did not know"),
        Tag("correction", "something you had wrong is now right"),
        Tag("blocked", "blocked, and on what"),
        # WHAT IS LEFT AFTER `update` WAS TAKEN OUT. Every remaining tag describes the
        # message it rides on and nothing else, so none of them can be worn wrongly:
        #   info   is about the WORLD        — a monitor started, a long build running
        #   reply  is about the CONVERSATION — you answering what was asked
        # Progress on the work is no longer a tag at all. See LEGACY below.
        Tag("info", "something happening that is worth knowing but is not work progress"),
        # THE TAG THAT MAKES THE RULE ENFORCEABLE. Every message carries one, so the check
        # is binary and needs no judgement — and a message that carries nothing durable must
        # therefore have something honest to wear. Without this, "tag every message" is a
        # rule the agent MUST break, and a rule that must be broken teaches that rules can
        # be. It files as routine and the digest drops it.
        Tag("reply", "answering what was asked, directly. Routine; kept out of the digest"),
    )
}


#: RETIRED, AND STILL READ. `update` was a tag until the user struck it: it was the one
#: whose correctness depended on something OUTSIDE the message it rode on — an open scope
#: — so it was the only one that could be worn wrongly, and the first thing it did in the
#: wild was answer a direct question. Progress on work is now `journal update`, a command,
#: because it is about the work rather than about the message.
#:
#: It stays readable because A TAG'S SPELLING IS A STORAGE FORMAT: transcripts already on
#: disk carry `[!update]`, and deleting the word outright would make every one of those
#: messages read back as untagged — a silent rewriting of what was already filed.
LEGACY = {"update": "retired — progress on work is `journal update` now"}


def found(text: str) -> list[str]:
    m = PATTERN.match(text or "")
    return [m.group(1)] if m and m.group(1) in (TAGS.keys() | LEGACY.keys()) else []


#: Tags that mean "nothing durable here". Filed, and elided from a read-back.
ROUTINE = {"reply"}


def carried(text: str) -> bool:
    return any(t not in ROUTINE for t in found(text))


#: THE ONE MARK THAT IS NOT A TAG. A tag says what KIND of message this is and every message has
#: exactly one; this says the message matters more than the rest, and most messages do not carry it.
#: It rides after the tag — `[!discovery][!] the cause was …` — so the tag stays the first thing on
#: the line and the check for it stays binary.
FLAG = re.compile(r"\A\s*\[!([a-z]+)\]\s*\[!\]")


def flagged(text: str) -> bool:
    return bool(FLAG.match(text or ""))


def strip(text: str) -> str:
    return PATTERN.sub("", FLAG.sub(lambda m: f"[!{m.group(1)}]", text or "", count=1), count=1).strip()
