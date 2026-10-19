from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import V3Row, seconds
from journal.models.plan_state import PlanState
from journal.features.workers.subagents import Subagents
from journal.repositories.agents import Agents
from journal.repositories.plans import Plans

STATUS = {PlanState.DRAFT: "building", PlanState.READY: "ready", PlanState.REVIEWING: "reviewing", PlanState.APPROVED: "approved", PlanState.STARTED: "active", PlanState.PARKED: "parked", PlanState.DONE: "done", PlanState.CANCELLED: "abandoned"}


class PlansShaper(Shaper):
    type = "plan"

    def __init__(self, plans: Plans, agents: Agents, subagents: Subagents) -> None:
        self.plans, self.agents, self.subagents = plans, agents, subagents

    def rows(self) -> list[V3Row]:
        return [self.row(p) for p in self.plans.in_()]

    def row(self, p) -> V3Row:
        tasks, phases = self.plans.tasks_of(p), self.plans.phases_of(p)
        drawn = [{"title": phase.title, "todos": [t.id for t in self.plans.tasks_in(phase)], "when": phase.complete_when, "checkpoint": phase.checkpoint} for phase in phases]
        phased = {t for phase in drawn for t in phase["todos"]}
        loose = [t.id for t in tasks if t.id not in phased]
        if loose:
            drawn.append({"title": "Under no phase yet", "todos": loose, "when": "", "checkpoint": False, "loose": True})
        return V3Row.of("plan", p, title=p.title, brief=p.brief, refs=[f"todo:{t.id}" for t in tasks], completed=seconds(p.updated_at) if p.state.is_closed() else 0.0,
                        data={"status": self.status(p), "stage": self.stage(p, phases, tasks), "phases": drawn, "current": self.plans.current_phase(p), "dismissed": False, "reviewers": self.reviewers(p)})

    def status(self, p) -> str:
        """Version 3's word for the plan's state; a started plan standing at a checkpoint waits for the user."""
        if p.state == PlanState.STARTED and self.plans.at_checkpoint(p) is not None:
            return "waiting"
        return STATUS[p.state]

    def reviewers(self, p) -> int:
        """The plan's reviewers still out while it is in review: the subagents of the live agents whose brief names it."""
        if p.state != PlanState.REVIEWING:
            return 0
        return sum(self.subagents.running_about(a.session, f"plan {p.id}") for a in self.agents.in_() if a.state != "ended")

    @staticmethod
    def stage(p, phases, tasks) -> str:
        """Where the building stands: the goal, then the phases, then the tasks, then ready."""
        if p.state != PlanState.DRAFT:
            return "ready"
        if not p.brief:
            return "goal"
        return "phases" if not phases else "todos"
