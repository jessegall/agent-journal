from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.skill import Skill
from journal.features.plans.commands.plan_command import PlanCommand
from journal.features.plans.listeners.advance_plan import AdvancePlan
from journal.features.plans.states.following_plan import FollowingPlan


class Plans(Feature):
    name = "plans"
    title = "Plans"
    states = (FollowingPlan,)
    commands = (PlanCommand,)
    listeners = (AdvancePlan,)

    NEXT = Nudge(name, "next", "plan {{n}}: task {{task}} is next, {{title}}", repeat_after=0)
    DONE = Nudge(name, "done", "plan {{n}} is done: its last task closed", repeat_after=0)
    PARKED = Nudge(name, "parked", "the user parked plan {{n}}")
    nudges = (NEXT, DONE, PARKED)

    skill = Skill("plans", 'Build and follow a plan of ordered tasks; load it when the user asks for a plan or a roadmap', """
# Plans

A plan is ordered tasks. Following it means finishing one and starting the next until the last.

- `journal plan create "<title>" --brief "<goal>"` drafts it; `journal plan add <n> "<task title>"` adds tasks in order.
- `journal plan start <n>` starts its first open task and follows the plan: `journal task done` on the task in
  hand starts the next one and names it; the last one ends the plan.
- `journal plan show <n>` lists its tasks and their states; `journal plan park <n>` puts it aside.
- Build the plan with the user: draft, show it, add what they ask, then start it on their word.
""", keywords=('plan', 'plans', 'roadmap', 'phases'), required_in=('following_plan',))
