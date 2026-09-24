from features.parts import ActionInterceptor, Context
from resources.base import AGENT, Refused

CARD_LINE = 140
PANEL_REPLY = 200


class DraftsCarryOneLine(ActionInterceptor):
    def intercept(self, context: Context, controller, **args):
        if controller.type != "ticket" or not controller.resource(data=controller._shaped(args)).draft:
            return None
        line = (args.get("abstract") or "").strip()
        if not line or len(line) > CARD_LINE:
            raise Refused(f'a draft ticket carries --abstract "<one line>" of at most {CARD_LINE} characters, shown whole on its card; '
                          f'the deeper explanation goes in --brief and shows under More info')
        return None


class PanelRepliesStayShort(ActionInterceptor):
    def intercept(self, context: Context, controller, **args):
        about = str(args.get("about") or "")
        if controller.type != "comment" or controller.actor != AGENT or not about.startswith("message:"):
            return None
        message = context.journal.messages.load(int(about.split(":")[1]))
        if not any(ref.startswith("board:") for ref in message.refs):
            return None
        text = "\n".join(line for line in (args.get("brief") or "").split("\n") if not line.startswith(">")).strip()
        if len(text) > PANEL_REPLY:
            raise Refused(f"your reply to the board is {len(text)} characters, and the New work panel shows one short line of at most "
                          f"{PANEL_REPLY}: say it again, shorter, about the tickets only")
        return None
