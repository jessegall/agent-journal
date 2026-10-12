
from events.rules import RuleChanged, RuleCreated
from features.journal_laws.briefing import brief
from framework.parts import Context, Handler
from resources.base import AGENT
from controllers.types import Agents, Rules


class InjectRules(Handler):
    def handle(self, context: Context, event: RuleChanged) -> None:
        brief(context.record.root.parent, context.record)


class ReviewNewRule(Handler):
    def handle(self, context: Context, event: RuleCreated) -> None:
        if event.actor != AGENT:
            return
        agent = context.journal.get(Agents).primary()
        if agent:
            context.speaking_to(agent).agent.whisper("review", n=event.n, title=context.journal.get(Rules).load(event.n).title)
