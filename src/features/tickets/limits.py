from features.parts import ActionInterceptor, Context
from resources.base import Refused

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
