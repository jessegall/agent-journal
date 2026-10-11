from engine.events.resources import RuleCreated
from expects import Given, Nudged, Unchanged, Wrote, File
from features.base import Feature
from features.journal import Journal
from controllers.types import Rules
from features.recital import register_recital
from features.rules.details import RulesDetails
from features.rules.handlers import InjectRules, ReviewNewRule, RuleChanged
from resources.base import AGENT, USER
from resources.types import AgentRow, Rule


AGENT_ROW = AgentRow(n=1, title="claude-1")
NEW = Rule(n=3, title="Never skip the gate", brief="It runs before every merge.")


def made(actor: str) -> RuleCreated:
    return RuleCreated(n=3, type="rule", action="created", actor=actor)


class RulesFeature(Feature):
    details = RulesDetails

    def register(self, journal: Journal) -> None:
        register_recital(journal, Rules)
        journal.events.handler(InjectRules(), expects=[
            Given(RuleChanged(n=3, type="rule", action="created", actor=USER), rows=[Rule(n=3, title="Never skip the gate", data={"injected": True})])
                >> Wrote(File("AGENTS.md", "- Never skip the gate")) & Wrote(File("CLAUDE.md", "@AGENTS.md")),
            Given(RuleChanged(n=3, type="rule", action="created", actor=USER), rows=[Rule(n=3, title="Never skip the gate")])
                >> Wrote(File("AGENTS.md", "agent-journal, form")) & Wrote(File("CLAUDE.md", "@AGENTS.md")),
        ])
        journal.events.handler(ReviewNewRule(), expects=[
            Given(made(AGENT), rows=[NEW, AGENT_ROW]) >> Nudged("review"),
            Given(made(USER), rows=[NEW, AGENT_ROW]) >> Unchanged(),
            Given(made(AGENT), rows=[NEW]) >> Unchanged(),
        ])
