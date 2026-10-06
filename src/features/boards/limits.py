from features.boards.controller import Boards
from features.boards.resource import PANEL_REPLY
from resources.base import AGENT, SYSTEM, Refused
from features.parts import ActionInterceptor, Context
from features.sequences.controller import Sequences
from features.boards.exploration import FILLER
from features.boards.drafting import BUILDING_A_BOARD, DRAFTING, DRAFTING_FROM_A_DOCUMENT, REVISING_THE_DRAFTS
from features.boards.exploration import EXPLORATION
from controllers.types import Messages

BOARD_SEQUENCES = {shipped.title for shipped in (EXPLORATION, DRAFTING, REVISING_THE_DRAFTS, DRAFTING_FROM_A_DOCUMENT, BUILDING_A_BOARD)}
HELD = ("plan", "question")


def filling(controller) -> str:
    if controller.agent == FILLER:
        return FILLER
    found = Sequences(controller.record, actor=controller.actor).in_hand()
    return found[0].title if found and found[0].title in BOARD_SEQUENCES else ""


class BoardWorkStaysOnTheBoard(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, **args):
        if controller.actor != AGENT or controller.type not in HELD or args.get("hidden"):
            return None
        running = filling(controller)
        if running:
            raise Refused(f"the {running} is filling the board: the work goes on its board, so ask with journal board ask "
                          f"and draft tickets with journal ticket create; no {controller.type} of its own")
        return None


class PanelRepliesStayShort(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, **args):
        about = str(args.get("about", ""))
        if controller.type != "comment" or controller.actor != AGENT or not about.startswith("message:"):
            return None
        message = feature_context.journal.get(Messages).load(about.split(":")[1])
        if not Boards(feature_context.record, actor=SYSTEM).of_message(message):
            return None
        text = "\n".join(line for line in (args.get("brief") or "").split("\n") if not line.startswith(">")).strip()
        if len(text) > PANEL_REPLY:
            raise Refused(f"your reply to the board is {len(text)} characters, and the New work panel shows one short line of at most "
                          f"{PANEL_REPLY}: say it again, shorter, about the tickets only")
        return None


FILLER_WRITES = ("board", "ticket", "sequence", "question", "comment", "message")


class FillerKeepsToTheBoard(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, **args):
        if controller.agent != FILLER or controller.type in FILLER_WRITES:
            return None
        raise Refused(f"the board's agent writes cards, never a {controller.type}: draft the request as a card with journal ticket create "
                      f'"<title>" --abstract "<one line>" --set board=<n> --set draft=true, or revise one with journal ticket update <n>')
