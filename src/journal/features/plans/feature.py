from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill
from journal.features.plans.commands.plan_command import PlanCommand
from journal.features.plans.listeners.advance_plan import AdvancePlan
from journal.features.plans.listeners.follow_plan_at_start import FollowPlanAtStart
from journal.features.plans.listeners.reopen_finished_plan import ReopenFinishedPlan
from journal.features.plans.listeners.tell_approved import TellApproved
from journal.features.plans.seeds.closed_plans import ClosedPlans
from journal.features.plans.states.following_plan import FollowingPlan


class Plans(Feature):
    name = "plans"
    title = "Plans"
    help = "A plan is a goal, phases and the tasks under them, built with the user and started on their approval; following it, finishing one task starts the next."
    states = (FollowingPlan,)
    commands = (PlanCommand,)
    listeners = (AdvancePlan, TellApproved, FollowPlanAtStart, ReopenFinishedPlan)
    checks = (
        Entry(NodeKind.CHECK, 'plan_at_checkpoint', 'Plan at a checkpoint?', 'a started plan stands at a completed checkpoint phase, its next phase not begun'),
    )
    seeds = (ClosedPlans,)

    NEXT = Nudge(name, "next", "plan {{n}}: task {{task}} is next, {{title}}", repeat_after=0)
    DONE = Nudge(name, "done", "plan {{n}} is done: its last task closed", repeat_after=0)
    WAITING = Nudge(name, "waiting", "plan {{n}}: no open task is left, and {{blocked}} on something outside", "`journal task list` names what each waits on; the plan goes on when one is unblocked", repeat_after=0)
    PARKED = Nudge(name, "parked", "the user parked plan {{n}}")
    APPROVED = Nudge(name, "approved", "the user approved plan {{n}}", "`journal plan start {{n}}` begins its first task", repeat_after=0)
    CHECKPOINT = Nudge(name, "checkpoint", "plan {{n}}: phase {{phase}} is complete and a checkpoint", "the user looks before the next phase; wait for their word, then `journal plan start {{n}}`", repeat_after=0)
    CHECKPOINT_PASSED = Nudge(name, "checkpoint_passed", "plan {{n}}: phase {{phase}} is complete, and in auto mode it does not stop you", "`journal plan start {{n}}` begins the next phase; carry on", repeat_after=0)
    nudges = (NEXT, DONE, WAITING, PARKED, APPROVED, CHECKPOINT, CHECKPOINT_PASSED)

    skill = Skill("plans", 'Build and follow a plan of ordered tasks; load it when the user asks for a plan or a roadmap', """
# Plans

A plan is a goal, phases in order, and the tasks under each phase. It is built with the user, made ready
by you, approved by them, and then followed: finishing one task starts the next until the last.

- `journal plan create "<title>" --brief "<goal>"` drafts it; `journal plan brief <n> "<goal>"` resets the goal.
- `journal plan phase <n> "<title>" --when "<complete when>"` adds a phase, `--checkpoint` where the user
  should look before the plan goes on.
- `journal plan add <n> "<task title>" --brief "<done when>"` files a task; `journal plan todos <n> <phase> <tasks…>`
  puts tasks under a phase by its number from 1.
- `journal plan ready <n>` when every phase has its tasks. Only the user approves, on the plan page or with
  `journal plan approve <n>`; you are told, and `journal plan start <n>` begins its first task.
- Asked for a review of a plan: `journal plan review <n>` before the reviewers go out. In review it cannot be approved,
  and `journal plan ready <n>` waits until every subagent is back. Put what they find straight into the plan as tasks
  under its phases, then ready it again.
- `journal plan show <n>` lists its phases and tasks; `journal plan park <n>` puts it aside.
""", keywords=('plan', 'plans', 'roadmap', 'phases'), required_in=('following_plan',))
