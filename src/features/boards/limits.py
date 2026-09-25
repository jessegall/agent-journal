from resources.base import AGENT, Refused
from features.parts import ActionInterceptor, Context
from features.sequences.controller import Sequences
from features.sequences.exploration import FILLER
from features.sequences.shipped import BUILDING_A_BOARD, DRAFTING, DRAFTING_FROM_A_DOCUMENT, EXPLORATION, REVISING_THE_DRAFTS

BOARD_SEQUENCES = {shipped["title"] for shipped in (EXPLORATION, DRAFTING, REVISING_THE_DRAFTS, DRAFTING_FROM_A_DOCUMENT, BUILDING_A_BOARD)}
HELD = ("plan", "question")


class BoardWorkStaysOnTheBoard(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, **args):
        if controller.actor != AGENT or controller.type not in HELD or args.get("hidden"):
            return None
        found = Sequences(controller.record, actor=controller.actor)._in_hand()
        running = FILLER if controller.agent == FILLER else found[0].title if found and found[0].title in BOARD_SEQUENCES else ""
        if running:
            raise Refused(f"the {running} is filling the board: the work goes on its board, so ask with journal board ask "
                          f"and draft tickets with journal ticket create; no {controller.type} of its own")
        return None
