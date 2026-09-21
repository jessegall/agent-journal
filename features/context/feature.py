import time

from controllers.types import Rules
from features import trigger
from features.base import Behaviour, Feature, command, event, Line
from features.context.reread import owed, standing


class Context(Feature):
    name = "context"
    lines = {"decide": Line("context {{percent}}% full, decide", 'a fact is what a later reader would get wrong without, a rule binds every environment, or nothing "<why>"'),
             "decide held": Line('context {{percent}}% full — decide before any other write — journal fact, journal rule, or journal nothing "<why>"'),
             "reread": Line("the reading pass over every rule and fact is owed", "journal rule reread")}
    title_ = "Memory"
    abstract_ = "At each mark of the context window the agent decides — fact, rule or nothing — before any other write; and every week it reads every rule and fact again"
    help_ = ("The marks are the trigger's at list; a fact, a rule, or journal nothing \"<why>\" releases the hold. "
             "journal rule reread prints every standing rule and fact in full and marks the reading done; it is owed again a week later.")
    behaviours = {"rereading": Behaviour("Read every rule and fact again each week", "Named once a day while the reading is owed",
                                         trigger={"every": 1440, "unit": trigger.MINUTES})}
    trigger = {"at": [50, 70, 90, 95], "unit": trigger.PERCENT}

    @event("agent.updated")
    def ask(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent.decided:
            return self.release(record, agent=agent)
        if self.due(record, agent):
            pct = agent.context
            self.hold(record, "decide held", agent=agent, percent=pct)
            self.journal.say(record, agent, "decide", percent=pct)

    @event("fact.created")
    @event("rule.created")
    def decided(self, event, record) -> None:
        self.release(record)

    @event("agent.updated")
    def reread_owed(self, event, record) -> None:
        agent = self.agent(event, record)
        if agent and self.due(record, agent, "rereading") and owed(record):
            self.journal.say(record, agent, "reread")

    @command("rule")
    def reread(self, rules: Rules) -> str:
        rows = standing(rules.record)
        rules.record.cleanup_read_at = time.time()
        return "\n\n".join(f"{r.type} {r.n}  {r.title}\n{r.brief}".rstrip() for r in rows)
