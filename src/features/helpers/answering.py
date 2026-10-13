from controllers.helpers.reuse import named_paths, refusal
from events.answers import Allowed, Answer, Refused
from events.asking import AgentDispatching, ToolCallAsked
from payload import runs_tests
from receiving import Answerer
from resources.types import Helper
from serving import ReadRows, Settings

NEVER_RUN_TESTS = ("Helpers and subagents write tests but never run them: write the test that proves your change, commit, and name it in your report so the agent that dispatched you runs it. "
                   "That agent can allow your runs with journal helper allow_suite.")


class OfferKeptAgentsFirst(Answerer[AgentDispatching]):
    def answer(self, event: AgentDispatching, helpers: ReadRows[Helper], settings: Settings) -> Answer:
        if event.subagent:
            return Allowed()
        why = refusal(helpers.census(), settings, event.kind or "subagent", named_paths(f"{event.description}\n{event.prompt}"))
        return Refused(why) if why else Allowed()


class RefuseTestRunsToHelpers(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, helpers: ReadRows[Helper]) -> Answer:
        helper = helpers.helper_here()
        if not event.command or not (event.subagent or helper) or not runs_tests(event.command) or (helper and helper.whole_suite):
            return Allowed()
        return Refused(NEVER_RUN_TESTS)
