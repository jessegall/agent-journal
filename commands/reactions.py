from __future__ import annotations

import fmt
from app import catalogue
from command import Parsed
from commands.resource import Resource
from controllers.reactions import ReactionsController

NOUNS = (("reactions", "reaction"), ("react",))

CONTROLLER = ReactionsController()

PAGE = {
    "lead": "A face on a turn, left by either side. The user's is told to you the way a reply is — a thumbs up "
            "on \"I'll do this next\" is a yes, and one nobody hears is one nobody gave.",
    "empty": "Nothing has been reacted to here.",
}


class List(Resource):
    signature = "reactions:list"
    default = True
    controller = CONTROLLER
    action = "index"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        import reactions
        rows = result.data or {}
        items = [fmt.Item(n=i, text=turn, meta=reactions.facts(on)) for i, (turn, on) in enumerate(rows.items(), 1)]
        return catalogue("REACTIONS", f"{len(rows)} turn(s)", (items, 0), PAGE["empty"], PAGE["lead"],
                         (('journal react <message> "👍"', "react to what the user said; the same face again takes it off"),),
                         noun="reactions")


class React(Resource):
    signature = 'react {turn : the message number, or a turn key from the thread} {face : one of 👍 ❤️ 🎉 😄 👀 🙏}'
    writes = True
    controller = CONTROLLER
    action = "store"

    def payload(self, p: Parsed):
        got = super().payload(p)
        # A NUMBER MEANS A MESSAGE. The agent reacts to what the user said, which is a message row;
        # the long keys are the viewer's business, and are accepted as they come.
        turn = str(got.turn or "").strip()
        got.turn = f"message:{turn}" if turn.isdigit() else turn
        return got


COMMANDS = (List, React)
