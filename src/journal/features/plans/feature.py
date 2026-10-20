from journal.support.entry import Entry
from journal.features.feature import Feature
from journal.features.plans.support.plans_standing_reader import PlansStandingReader
from journal.features.plans.listeners.block_plan_on_its_tasks import BlockPlanOnItsTasks
from journal.features.plans.listeners.clear_plan_waits import ClearPlanWaits
from journal.features.plans.listeners.count_plan_reviewers import CountPlanReviewers
from journal.engine.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.support.skill import Skill
from journal.features.plans.commands.plan_command import PlanCommand
from journal.features.plans.listeners.advance_plan import AdvancePlan
from journal.features.plans.listeners.reopen_finished_plan import ReopenFinishedPlan
from journal.features.plans.listeners.reopen_plan_of_reopened_task import ReopenPlanOfReopenedTask
from journal.features.plans.support.plans_conduct import PlansConduct
from journal.features.plans.seeds.closed_plans import ClosedPlans
from journal.features.plans.states.following_plan import FollowingPlan


class Plans(Feature):
    name = "plans"
    title = "Plans"
    help = "A plan is a goal, phases and the tasks under them, built with the user and started on their approval; following it, finishing one task starts the next."
    states = (FollowingPlan,)
    commands = (PlanCommand,)
    listeners = (BlockPlanOnItsTasks, ClearPlanWaits, CountPlanReviewers, AdvancePlan, ReopenFinishedPlan, ReopenPlanOfReopenedTask)
    conduct = (PlansConduct,)
    standing = (PlansStandingReader,)
    checks = (
        Entry(NodeKind.CHECK, 'plan_moved_on', 'Plan moved on to its next task?', 'a task just closed and the agent follows its plan at the next one'),
        Entry(NodeKind.CHECK, 'plan_left_waiting', 'Plan has no task to start?', 'a task just closed and no task of the plan can start, the plan at no checkpoint'),
        Entry(NodeKind.CHECK, 'approved_plan', 'Has an approved plan not started?', 'the user approved a plan here that is not started yet'),
        Entry(NodeKind.CHECK, 'follows_a_plan', 'Follows a plan?', 'the agent follows a plan, which takes its tasks in hand for it'),
        Entry(NodeKind.CHECK, 'plan_at_checkpoint', 'Plan at a checkpoint?', 'a started plan stands at a completed checkpoint phase, its next phase not begun'),
    )
    seeds = (ClosedPlans,)

    NEXT_TASK_OF_THE_PLAN = Nudge(name, "next_task_of_the_plan", "plan {{n}}: task {{task}}, {{title}} is next. {{briefing}}", repeat_after=0)
    PLAN_DONE = Nudge(name, "plan_done", "plan {{n}} is done: its last task closed", repeat_after=0)
    PLAN_WAITS_ON_ITS_TASKS = Nudge(name, "plan_waits_on_its_tasks", "plan {{n}}: no task can start now; {{left}} parked, blocked or waiting", "`journal task list` says what each waits on; when one can go on, `journal plan start {{n}}` takes it up", repeat_after=0)
    THE_USER_PARKED_THE_PLAN = Nudge(name, "the_user_parked_the_plan", "the user parked plan {{n}}")
    THE_USER_APPROVED_THE_PLAN = Nudge(name, "the_user_approved_the_plan", "the user approved plan {{n}}", "`journal plan start {{n}}` begins its first task", repeat_after=0)
    PHASE_COMPLETE_AT_A_CHECKPOINT = Nudge(name, "phase_complete_at_a_checkpoint", "plan {{n}}: phase {{phase}} is complete and a checkpoint", "the user looks before the next phase; wait for their word, then `journal plan start {{n}}`", repeat_after=0)
    PHASE_COMPLETE_GO_ON = Nudge(name, "phase_complete_go_on", "plan {{n}}: phase {{phase}} is complete, and in auto mode it does not stop you", "`journal plan start {{n}}` begins the next phase; carry on", repeat_after=0)
    PLAN_BLOCKED = Nudge(name, "plan_blocked", "plan {{n}} is blocked: {{why}}", "it opens again by itself when what it waits on comes; `journal plan unblock {{n}}` opens it by hand", repeat_after=0)
    PLAN_OPEN_AGAIN = Nudge(name, "plan_open_again", "plan {{n}} is open again: {{why}}", "`journal plan start {{n}}` goes on with it", repeat_after=0)
    ALL_BLOCKED = "all its tasks left are blocked"
    nudges = (NEXT_TASK_OF_THE_PLAN, PLAN_DONE, PLAN_WAITS_ON_ITS_TASKS, THE_USER_PARKED_THE_PLAN, THE_USER_APPROVED_THE_PLAN, PHASE_COMPLETE_AT_A_CHECKPOINT, PHASE_COMPLETE_GO_ON, PLAN_BLOCKED, PLAN_OPEN_AGAIN)

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
""", keywords=('plan', 'plans', 'roadmap', 'phases'), required_in=('following_plan',))
