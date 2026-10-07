from features.agent_sessions.launch import PROVIDER, start_agent_in
from features.plans.controller import Plans
from features.plans.resource import PHASE
from providers import DRIVERS
from resources.base import SYSTEM
from resources.types import EnvironmentKind

SHARED = "shared"


def worker_environment(plan) -> str:
    return f"plan-{plan.n}"


def kickoff(plan) -> str:
    if plan.worktree == SHARED:
        return (f"You are the agent of plan {plan.n}, {plan.title}, with this environment and one worktree for the whole plan. Its "
                f"phases hold board tickets, and the journal hands you each phase's tickets once the phase before is done. You do "
                f"every ticket's work yourself, here, one ticket after another: follow the plan (journal plan show {plan.n}) and each "
                f"ticket (journal ticket show <n>), commit on this worktree's branch, and say when a ticket is done. Never merge "
                f"the branch yourself.")
    return (f"You are the worker agent of plan {plan.n}, {plan.title}, with this environment and a worktree of your own. Its phases "
            f"hold board tickets, and the journal starts each phase's tickets once the phase before is done. You orchestrate: "
            f"follow the plan (journal plan show {plan.n}) and its tickets (journal ticket show <n>), answer their agents when "
            f"they ask, check each ticket's result against its phase's complete-when line, and when a phase is stuck, say so to "
            f"the user in the chat. Do not do the tickets' own work.")


def start_worker(record, plan) -> str:
    if not any(phase.get(PHASE.tickets) for phase in plan.phases):
        return ""
    name = worker_environment(plan)
    if plan.worktree == SHARED:
        Plans(record, actor=SYSTEM).update(plan.n, branch=DRIVERS[PROVIDER].branch(name))
    return start_agent_in(record, name, name, f"Where the worker agent of plan {plan.n} orchestrates it", plan.ref, kickoff(plan), EnvironmentKind.TICKET)

