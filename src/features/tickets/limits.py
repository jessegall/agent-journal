from features.boards.controller import PANEL_REPLY
from features.parts import ActionInterceptor, Context
from features.sequences.exploration import FILLER
from resources.base import AGENT, Refused

CARD_LINE = 140
CARD_TITLE = 60


class DraftsCarryOneLine(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, **args):
        if controller.type != "ticket" or not self._draft(controller, args):
            return None
        line = args.get("abstract")
        if ("n" not in args or line is not None) and not 0 < len((line or "").strip()) <= CARD_LINE:
            raise Refused(f'a draft ticket carries --abstract "<one line>" of at most {CARD_LINE} characters, shown whole on its card; '
                          f'the deeper explanation goes in --brief and shows under More info')
        if len((args.get("title") or "").strip()) > CARD_TITLE:
            raise Refused(f"a draft ticket's title names it in at most {CARD_TITLE} characters, so its card shows it whole")
        return None

    @staticmethod
    def _draft(controller, args) -> bool:
        if "n" in args:
            return controller.load(args["n"]).draft
        return controller.resource(data=controller._shaped(args)).draft


class PanelRepliesStayShort(ActionInterceptor):
    def intercept(self, context: Context, controller, **args):
        about = str(args.get("about", ""))
        if controller.type != "comment" or controller.actor != AGENT or not about.startswith("message:"):
            return None
        message = context.journal.messages.load(about.split(":")[1])
        if not any(ref.startswith("board:") for ref in message.refs):
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
