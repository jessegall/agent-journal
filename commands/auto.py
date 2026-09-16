from __future__ import annotations

import fmt
from command import Parsed
from commands.resource import Resource
from controllers.journal import JournalController
from templates import render

NOUNS = (("auto-mode", "auto"),)

CONTROLLER = JournalController()

TEXT = {
    "state": "auto mode is {state} for this journal. `journal auto-mode enable|disable` sets it.",
    "working": "  Agent currently working on: {subjects:; }",
    "after_work": "  {n} to-do(s) waiting; the first ready one is picked up when that work ends.",
    "next": "  Nothing is open, {n} to-do(s) waiting: the next idle stop starts to-do {next}, {title}.",
    "stuck": "  Nothing is open and none of the {n} waiting to-do(s) can be started — they wait on you, on a "
             "condition, or on each other. `journal todos` says which.",
    "empty": "  Nothing is open and nothing is waiting.",
}


class AutoMode(Resource):
    """Auto mode for the whole journal: shown bare, switched by its verb."""
    controller = CONTROLLER
    action = "auto"
    state = ""

    def extra(self, p: Parsed):
        return {"state": self.state} if self.state else {}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        m = result.meta
        if "set" not in m:
            fmt.say(render(TEXT["state"], state="ON" if m["on"] else "OFF"))
            return 0
        fmt.say(result.message)
        if not m["on"]:
            return 0
        if m["working"]:
            fmt.say(render(TEXT["working"], subjects=m["working"]))
            fmt.say(render(TEXT["after_work"], n=m["waiting"]))
        elif m["next"]:
            fmt.say(render(TEXT["next"], n=m["waiting"], next=m["next"]["n"], title=m["next"]["title"]))
        elif m["waiting"]:
            fmt.say(render(TEXT["stuck"], n=m["waiting"]))
        else:
            fmt.say(TEXT["empty"])
        return 0


class Show(AutoMode):
    signature = "auto-mode:show"
    default = True


class Enable(AutoMode):
    signature = "auto-mode:enable"
    verbs = ("on",)
    writes = True
    state = "enable"


class Disable(AutoMode):
    signature = "auto-mode:disable"
    verbs = ("off",)
    writes = True
    state = "disable"


COMMANDS = (Show, Enable, Disable)
