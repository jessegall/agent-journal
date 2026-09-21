from features import trigger
from features.base import Behaviour, Feature, event, Line
from features.context.commands import Reread
from features.context.reread import owed
from features.journal import Journal


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

    def register(self, journal: Journal) -> None:
        journal.commands.add("rule", Reread())

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
