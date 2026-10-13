from events.rules import RuleChanged, RuleCreated, RulesToInject
from expects import Dispatches, Given, Nudged, Unchanged
from framework.base import Feature
from framework.journal import Journal
from controllers.types import Rules
from framework.recital import register_recital
from events.rules import RuleMentioned, RulesStanding
from features.rules.details import RulesDetails
from features.rules.handlers import ReviewNewRule
from features.rules.listeners import SpotRuleChange
from resources.base import AGENT, USER
from resources.types import AgentRow, Rule


AGENT_ROW = AgentRow(n=1, title="claude-1")
NEW = Rule(n=3, title="Never skip the gate", brief="It runs before every merge.")


def made(actor: str) -> RuleCreated:
    return RuleCreated(n=3, type="rule", action="created", actor=actor)


class RulesFeature(Feature):
    details = RulesDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, Rules, RuleMentioned, RulesStanding)
        journal.events.listen(RuleChanged, SpotRuleChange(), expects=[
            Given(RuleChanged(n=3, type="rule", action="created", actor=USER)) >> Dispatches(RulesToInject()),
        ])
        journal.events.handle(RuleCreated, ReviewNewRule(), expects=[
            Given(made(AGENT), rows=[NEW, AGENT_ROW]) >> Nudged("review", n=3, title=NEW.title),
            Given(made(USER), rows=[NEW, AGENT_ROW]) >> Unchanged(),
            Given(made(AGENT), rows=[NEW]) >> Unchanged(),
        ])
