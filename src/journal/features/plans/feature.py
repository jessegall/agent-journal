from journal.features.feature import Feature
from journal.features.plans.support.plans_data_reader import PlansDataReader
from journal.features.plans.listeners.plan_blockade import PlanBlockade
from journal.features.plans.listeners.clear_plan_waits import ClearPlanWaits
from journal.features.plans.listeners.count_plan_reviewers import CountPlanReviewers
from journal.engine.nudge import Nudge
from journal.support.skill import Skill
from journal.features.plans.commands.plan_command import PlanCommand
from journal.features.plans.listeners.advance_plan import AdvancePlan
from journal.features.plans.listeners.reopen_finished_plan import ReopenFinishedPlan
from journal.features.plans.listeners.plan_reopening import PlanReopening
from journal.features.plans.support.plans_conduct import PlansConduct
from journal.features.plans.seeds.closed_plans import ClosedPlans
from journal.features.plans.states.following_plan import FollowingPlan


class Plans(Feature):
    name = "plans"
    title = "Plans"
    help = "A plan is a goal, phases and the tasks under them, built with the user and started on their approval; following it, finishing one task starts the next."
    states = (FollowingPlan,)
    commands = (PlanCommand,)
    listeners = (PlanBlockade, ClearPlanWaits, CountPlanReviewers, AdvancePlan, ReopenFinishedPlan, PlanReopening)
    conduct = (PlansConduct,)
    data = (PlansDataReader,)
    seeds = (ClosedPlans,)

    NEXT_PLAN_TASK = Nudge(name, "next_task_of_the_plan", "plan {{n}}: task {{task}}, {{title}} is next. {{briefing}}", repeat_after=0)
    PLAN_FINISHED = Nudge(name, "plan_done", "plan {{n}} is done: its last task closed", repeat_after=0)
    PLAN_STALLED = Nudge(name, "plan_waits_on_its_tasks", "plan {{n}}: no task can start now; {{left}} parked, blocked or waiting", "`journal task list` says what each waits on; when one can go on, `journal plan start {{n}}` takes it up", repeat_after=0)
    PLAN_POSTPONED = Nudge(name, "the_user_postponed_the_plan", "the user postponed plan {{n}}")
    PLAN_ABANDONED = Nudge(name, "the_user_abandoned_the_plan", "the user abandoned plan {{n}}")
    PLAN_APPROVED = Nudge(name, "the_user_approved_the_plan", "the user approved plan {{n}}", "`journal plan start {{n}}` begins its first task", repeat_after=0)
    CHECKPOINT_PHASE_END = Nudge(name, "phase_complete_at_a_checkpoint", "plan {{n}}: phase {{phase}} is complete and a checkpoint", "the user looks before the next phase; wait for their word, then `journal plan start {{n}}`", repeat_after=0)
    PHASE_END = Nudge(name, "phase_complete_go_on", "plan {{n}}: phase {{phase}} is complete, and in auto mode it does not stop you", "`journal plan start {{n}}` begins the next phase; carry on", repeat_after=0)
    PLAN_BLOCKED = Nudge(name, "plan_blocked", "plan {{n}} is blocked: {{why}}", "it opens again by itself when what it waits on comes; `journal plan unblock {{n}}` opens it by hand", repeat_after=0)
    PLAN_REOPENED = Nudge(name, "plan_reopened", "plan {{n}} is open again: {{why}}", "`journal plan start {{n}}` goes on with it", repeat_after=0)
    ALL_BLOCKED = "all its tasks left are blocked"
    UNAPPROVED_PLAN = Nudge(name, "plan_not_approved", "plan {{n}} is not approved, so it cannot be followed", "only the user approves a plan, on the plan page or with `journal plan approve {{n}}`", repeat_after=0)
    APPROVED_UNSTARTED = Nudge(name, "approved_unstarted", "plan {{n}} is approved and not started", "`journal plan start {{n}}` begins its first task", repeat_after=0)
    nudges = (UNAPPROVED_PLAN, APPROVED_UNSTARTED, NEXT_PLAN_TASK, PLAN_FINISHED, PLAN_STALLED, PLAN_POSTPONED, PLAN_ABANDONED, PLAN_APPROVED, CHECKPOINT_PHASE_END, PHASE_END, PLAN_BLOCKED, PLAN_REOPENED)

    skill = Skill("plans", 'Build and follow a plan of ordered tasks; load it when the user asks for a plan or a roadmap', """
# Plans

A plan is a goal, phases in order, and the tasks under each phase. It is built with the user, made ready
by you, approved by them, and then followed: finishing one task starts the next until the last.

- `journal plan create "<title>" --brief "<goal>"` drafts it; `journal plan brief <n> "<goal>"` resets the goal.
- `journal plan phase <n> "<title>" --when "<complete when>"` adds a phase, `--checkpoint` where the user
  should look before the plan goes on. A checkpoint stops the plan only when auto mode is off; in auto mode the plan goes
  straight on.
- `journal plan add <n> "<task title>" --brief "<done when>"` files a task; `journal plan todos <n> <phase> <tasks…>`
  puts tasks under a phase by its number from 1.
- `journal plan ready <n>` when every phase has its tasks. Only the user approves, on the plan page or with
  `journal plan approve <n>`; you are told, and `journal plan start <n>` begins its first task, and also goes on past a checkpoint.
- Asked for a review of a plan: `journal plan review <n>` before the reviewers go out. In review it cannot be approved,
  and `journal plan ready <n>` waits until every subagent is back. Put what they find straight into the plan as tasks
  under its phases, then ready it again with `--changed "<what the round changed, in one line>"`: each round is kept on the
  plan, with its reviewers, the reports filed about the plan while it ran, and that line.
- `journal plan show <n>` lists its phases and tasks; `journal plan list` every plan; `journal plan park <n>` puts it aside.
- A blocked task never blocks its plan: go on with the tasks that can be done. When every task left is blocked, the plan
  blocks itself and opens again when one opens. When one thing stops all of the plan's work, block the plan on it:
  `journal plan block <n> "<why>"`, with `--on question:N`, `--on task:N` or `--until "<command>"` as for a task, so it
  opens by itself; `journal plan unblock <n>` opens it by hand.
- `journal plan cancel <n>` gives it up, with the tasks that are its alone; tasks another live plan holds stay.
""", keywords=('plan', 'plans', 'roadmap', 'phases'), required_in=('following_plan', 'orchestrating_plan'))
