from __future__ import annotations

from pathlib import Path

import reactions
from controller import Controller, Payload, Result
from payloads import reactions as reaction_payloads


class ReactionsController(Controller):
    """What either side put on a turn. Not numbered: a reaction belongs to a TURN, and a turn is
    named by its key in the thread — `message:5`, `said:0:<time>` — not by a row number of its own."""
    resource = "reactions"
    noun = "reaction"
    actions = ("index", "store")
    numbered = ()
    payloads = {"store": reaction_payloads.ReactPayload}

    def index(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", reactions.all_of(root, p.env or None), {"faces": list(reactions.FACES)})

    def store(self, root: Path, p: reaction_payloads.ReactPayload) -> Result:
        by = "user" if p.source == "web" else "agent"
        took, said, off = reactions.leave(root, p.turn, p.face, p.at, by=by, track=p.env or None)
        if not took:
            return Result("refused", said)
        return Result("ok", said, {"turn": p.turn, "face": p.face, "by": by, "off": off,
                                   "on": reactions.on(root, p.turn, p.env or None)})
