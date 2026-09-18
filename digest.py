from __future__ import annotations

import tags
import transcript
from templates import render as fill

CONTEXT = 2  # messages either side of a prompt that are its context


MESSAGES = {
    "elided": "      ⋯ {n} message(s) ⋯",
    "user": "\n{n}  ▸ USER: {body}",
    "tags": "\\[{tags:/}\\] ",
    "agent": "{n}    {mark}{body}",
    "said": "\n{n}  {at}\n{text}",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def _near_prompt(lines, i: int, prompts: set[int]) -> bool:
    return any(abs(i - p) <= CONTEXT for p in prompts)


def select(lines) -> list:
    # ONLY A FILING UNIT CAN BE KEPT FOR PROXIMITY. Nearness to a prompt is a weak reason
    # — it keeps a line for where it sat, not for what it said — and applied to every text
    # block it dragged in the scaffolding: "Now wiring it into the CLI", "Let me check the
    # other file". The hook already stopped treating those as messages. This is the same
    # rule, read from the same place, so the two halves of the system cannot drift again.
    #
    # A TAG STILL WINS ON ITS OWN. A line that declared what it carried is kept whether or
    # not it ended its turn: the agent said it was worth reading back, and the digest has
    # no business overruling that with a structural guess.
    units = transcript.filing_units(lines)
    spoken = [l for l in lines if l.spoken and (l.text or "").strip()]
    prompts = {i for i, l in enumerate(spoken) if l.kind == "human"}
    # THE MESSAGE THE USER REACTED TO, AND THE ONE THAT ANSWERED THEM. A prompt is nearly
    # always a reaction: a correction, a steer, a "yes, do that". Shown alone it is a reply
    # to nothing. Proximity mostly keeps these, but a hook hold between the answer and the
    # prompt pushes the answer out of range — so the last filed message before each prompt
    # and the first after it are kept by name, whatever the distance.
    around: set[int] = set()
    unit_idx = [i for i, l in enumerate(spoken) if l.n in units]
    for p in prompts:
        before = [i for i in unit_idx if i < p]
        after = [i for i in unit_idx if i > p]
        if before:
            around.add(before[-1])
        if after:
            around.add(after[0])
    keep = []
    for i, line in enumerate(spoken):
        if (
            line.kind == "human"
            or tags.carried(line.text)
            or i in around
            or (line.n in units and _near_prompt(spoken, i, prompts))
        ):
            keep.append(line)
    return keep


def render(lines, *, elide: bool = True) -> str:
    keep = select(lines)
    kept = {l.n for l in keep}
    out: list[str] = []
    skipped = 0
    for line in (l for l in lines if l.spoken and (l.text or "").strip()):
        if line.n not in kept:
            skipped += 1
            continue
        if skipped and elide:
            out.append(say("elided", n=skipped))
        skipped = 0
        out.append(_one(line))
    if skipped and elide:
        out.append(say("elided", n=skipped))
    return "\n".join(out)


def _one(line) -> str:
    found = tags.found(line.text)
    body = tags.strip(line.text) if found else (line.text or "").strip()
    body = " ".join(body.split())
    if line.kind == "human":
        return say("user", n=str(line.n).rjust(5), body=body)
    mark = say("tags", tags=["!" + t for t in found]) if found else ""
    return say("agent", n=str(line.n).rjust(5), mark=mark, body=body[:600])


def users_only(lines) -> str:
    out = []
    for line in lines:
        if line.kind == "human":
            out.append(say("said", n=str(line.n).rjust(5), at=line.ts[:19], text=(line.text or "").strip()))
    return "\n".join(out)
