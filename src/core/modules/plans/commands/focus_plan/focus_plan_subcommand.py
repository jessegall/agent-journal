from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.plans.support.focus.plan_focus_report import PlanFocusReport

PERSON_HEADING = "the focus of the main agent:"


class FocusPlanSubcommand(ReadSubcommand[tuple[str, ...]]):
    """`journal plan focus`: the plan the asking agent works on first, where that focus comes from, and what each
    started plan waits on. A person reads the focus of the running main agent."""

    cli_name = "plan"
    name = "focus"

    def __init__(self, queries: Queries, report: PlanFocusReport) -> None:
        self.queries, self.report = queries, report

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> tuple[str, ...]:
        if caller.actor.type is ActorType.AGENT:
            return tuple(self.report.lines(self.queries.query(Agent).find(caller.actor.id)))
        main_agent = MainAgentFinder.newest(self.queries)
        if main_agent is None:
            raise Refusal("no main agent is running, so there is no focus to read", "journal launch")
        return (PERSON_HEADING, *self.report.lines(main_agent))

    def write_output(self, value: object, output: Output) -> None:
        for line in value if is_tuple(value) else ():
            output.line(str(line))
