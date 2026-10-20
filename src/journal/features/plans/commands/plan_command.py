from argparse import Namespace
from dataclasses import replace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.where import Where
from journal.engine.state_machine import StateMachine
from journal.features.plans.support.plan_control import PlanControl
from journal.features.plans.support.review_rounds import ReviewRounds
from journal.features.plans.states.following_plan import FollowingPlan
from journal.support.waits import Waits
from journal.support.subagents import Subagents
from journal.models.link import Link
from journal.models.phase import Phase
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.support.ref import Ref
from journal.models.task import Task
from journal.repositories.links import Links
from journal.support.refused import Refused
from journal.repositories.phases import Phases
from journal.repositories.plans import IN_PHASE, IN_PLAN, PHASE_OF, Plans
from journal.repositories.tasks import Tasks, WAITS_ON


class PlanCommand(Command):
    noun = "plan"

    def __init__(self, plans: Plans, phases: Phases, tasks: Tasks, links: Links, machine: StateMachine, subagents: Subagents, control: PlanControl, waits: Waits, rounds: ReviewRounds) -> None:
        self.plans, self.phases, self.tasks, self.links, self.machine, self.subagents, self.control, self.waits = plans, phases, tasks, links, machine, subagents, control, waits
        self.rounds = rounds

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "draft a plan")
        create.add_argument("title")
        create.add_argument("--brief", default="")
        add = self.verb(verbs, "add", "add a task to a plan, after the ones it has")
        add.add_argument("n", type=int)
        add.add_argument("title")
        add.add_argument("--brief", default="")
        add.add_argument("--first", action="store_true", help="put it before the tasks the plan has")
        brief = self.verb(verbs, "brief", "set a plan's goal, what is true when it is done")
        brief.add_argument("n", type=int)
        brief.add_argument("text")
        rephase = self.verb(verbs, "rephase", "a phase's title or its complete-when line written anew")
        rephase.add_argument("n", type=int)
        rephase.add_argument("phase", type=int, help="the phase's number from 1")
        rephase.add_argument("--title", default="")
        rephase.add_argument("--when", default="")
        phase = self.verb(verbs, "phase", "add a phase to a plan, after the ones it has")
        phase.add_argument("n", type=int)
        phase.add_argument("title")
        phase.add_argument("--when", default="", help="what is true when the phase is complete")
        phase.add_argument("--checkpoint", action="store_true", help="the user looks before the plan goes on")
        todos = self.verb(verbs, "todos", "put tasks under a phase of a plan, by the phase's number from 1")
        todos.add_argument("n", type=int)
        todos.add_argument("phase", type=int)
        todos.add_argument("tasks", type=int, nargs="+")
        ready = self.verb(verbs, "ready", "the plan is built: every phase has its tasks, and the user may approve it")
        ready.add_argument("n", type=int)
        ready.add_argument("--changed", help="after a review: what the round changed in the plan, in one line (tasks added, merged, moved, reworded)")
        self.verb(verbs, "review", "reviewers are reading the plan: it cannot be approved until they are back and their findings are in it").add_argument("n", type=int)
        self.verb(verbs, "approve", "the user's word: the plan may start").add_argument("n", type=int)
        self.verb(verbs, "start", "follow an approved plan, or go on past a checkpoint: its next open task is started").add_argument("n", type=int)
        self.verb(verbs, "park", "put a plan aside").add_argument("n", type=int)
        block = self.verb(verbs, "block", "a started plan waits on one thing before any of its work can go on; a plan whose every task left is blocked blocks itself")
        block.add_argument("n", type=int)
        block.add_argument("why", nargs="?", default="")
        Waits.arguments(block, "plan")
        self.verb(verbs, "unblock", "what the plan waited on came: it is started again").add_argument("n", type=int)
        self.verb(verbs, "cancel", "a plan given up, with the tasks that are its alone; one another live plan holds stays").add_argument("n", type=int)
        self.verb(verbs, "show", "a plan and its tasks").add_argument("n", type=int)
        self.verb(verbs, "list", "every plan here")

    def create(self, args: Namespace, where: Where) -> int:
        plan = self.plans.save(Plan(title=args.title, brief=args.brief), where.actor)
        print(f"plan {plan.id} {plan.state}")
        return 0

    def add(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        before = self.plans.tasks_of(plan) if args.first else []
        task = self.tasks.save(Task(environment_id=plan.environment_id, title=args.title, brief=args.brief), where.actor)
        self.links.save(Link(source=Ref.to(task), target=Ref.to(plan), kind=IN_PLAN), where.actor)
        for other in before:
            self.relink(other, plan, where)
        print(f"task {task.id} added to plan {plan.id}{' first' if args.first else ''}")
        return 0

    def relink(self, task: Task, plan: Plan, where: Where) -> None:
        """A plan's tasks stand in the order their links were made: a task linked again goes to the end."""
        for link in self.links.between(task, plan):
            self.links.delete(link, where.actor)
        self.links.save(Link(source=Ref.to(task), target=Ref.to(plan), kind=IN_PLAN), where.actor)

    def rephase(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        phase = self.plans.phases_of(plan)[args.phase - 1]
        changed = phase.with_(title=args.title or phase.title, complete_when=args.when or phase.complete_when)
        self.phases.save(changed, where.actor)
        print(f"phase {args.phase} of plan {plan.id} is now: {changed.title}")
        return 0

    def phase(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        phase = self.phases.save(Phase(environment_id=plan.environment_id, title=args.title, complete_when=args.when, checkpoint=args.checkpoint), where.actor)
        self.links.save(Link(source=Ref.to(phase), target=Ref.to(plan), kind=PHASE_OF), where.actor)
        print(f"phase {len(self.plans.phases_of(plan))} of plan {plan.id}")
        return 0

    def todos(self, args: Namespace, where: Where) -> int:
        """Tasks put under a phase, in the order given and after the ones it has: a task under another phase of the plan moves from it."""
        plan = self.plans.find(args.n)
        phases = self.plans.phases_of(plan)
        if not 1 <= args.phase <= len(phases):
            raise Refused(f"plan {plan.id} has {len(phases)} phases: name one by its number from 1")
        phase = phases[args.phase - 1]
        for n in args.tasks:
            task = self.tasks.find(n)
            if not self.links.between(task, plan):
                self.links.save(Link(source=Ref.to(task), target=Ref.to(plan), kind=IN_PLAN), where.actor)
            for link in [link for other in phases for link in self.links.between(task, other)]:
                self.links.delete(link, where.actor)
            self.links.save(Link(source=Ref.to(task), target=Ref.to(phase), kind=IN_PHASE), where.actor)
        print(f"tasks {', '.join(str(n) for n in args.tasks)} under phase {args.phase} of plan {plan.id}")
        return 0

    def ready(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        phases = self.plans.phases_of(plan)
        if not phases:
            raise Refused(f"plan {plan.id} has no phase yet: journal plan phase {plan.id} \"<title>\" --when \"<complete when>\"")
        empty = [i for i, phase in enumerate(phases, 1) if not self.plans.tasks_in(phase)]
        if empty:
            raise Refused(f"phase {', '.join(str(i) for i in empty)} of plan {plan.id} has no task yet: journal plan todos {plan.id} <phase> <tasks>")
        out = self.subagents.running_about(where.session, f"plan {plan.id}") if plan.state == PlanState.REVIEWING and where.session else 0
        if out:
            raise Refused(f"plan {plan.id} is in review and {out} of its reviewers are still out: wait for them, put what they found into the plan, then ready it")
        if plan.state == PlanState.REVIEWING:
            self.close_round(plan, args.changed, where)
        plan = self.plans.save(plan.ready(), where.actor)
        print(f"plan {plan.id} ready: the user approves it on the plan page")
        return 0

    def close_round(self, plan: Plan, changed: str | None, where: Where) -> None:
        if changed is None:
            raise Refused(f"plan {plan.id} is in review: say in one line what this round changed, journal plan ready {plan.id} --changed \"<tasks added, merged, moved, reworded>\"")
        self.rounds.close(plan, changed, where)

    def review(self, args: Namespace, where: Where) -> int:
        plan = self.plans.save(self.plans.find(args.n).reviewing(), where.actor)
        self.rounds.open(plan, where.actor)
        print(f"plan {args.n} in review: put what the reviewers find straight into it, then journal plan ready {args.n}")
        return 0

    def approve(self, args: Namespace, where: Where) -> int:
        if not where.actor.is_the_user():
            raise Refused("only the user approves a plan: ask, then wait for their word")
        plan = self.plans.approve(self.plans.find(args.n), where.actor)
        print(f"plan {plan.id} {plan.state}")
        return 0

    def start(self, args: Namespace, where: Where) -> int:
        print(self.control.start(self.plans.find(args.n), where.session, where.actor).rendered())
        return 0

    def block(self, args: Namespace, where: Where) -> int:
        self.waits.refuse_unnamed(args.why, args.on, args.until)
        plan = self.plans.save(self.plans.find(args.n).blocked(args.why), where.actor)
        for ref in self.waits.named(args.on, args.until, args.every, f"plan {plan.id}", where.actor):
            self.links.save(Link(source=Ref.to(plan), target=ref, kind=WAITS_ON), where.actor)
        print(f"plan {plan.id} blocked, waiting on: {self.tasks.reason(plan)}")
        return 0

    def unblock(self, args: Namespace, where: Where) -> int:
        plan = self.plans.save(self.plans.find(args.n).unblocked(), where.actor)
        print(f"plan {plan.id} open again: `journal plan start {plan.id}` goes on with it")
        return 0

    def park(self, args: Namespace, where: Where) -> int:
        plan = self.control.park(self.plans.find(args.n), where.session, where.actor)
        print(f"plan {plan.id} parked")
        return 0

    def cancel(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        gone = self.control.abandon(plan, where.session, where.actor)
        print(f"plan {plan.id} cancelled" + (f", with tasks {', '.join(str(t.id) for t in gone)}" if gone else ""))
        return 0

    def brief(self, args: Namespace, where: Where) -> int:
        plan = self.plans.save(replace(self.plans.find(args.n), brief=args.text), where.actor)
        print(f"plan {plan.id} brief set")
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        print(f"plan {plan.id} {plan.state}: {plan.title}")
        phased = set()
        for i, phase in enumerate(self.plans.phases_of(plan), 1):
            print(f"phase {i}: {phase.title}" + (f" (complete when {phase.complete_when})" if phase.complete_when else "") + (" [checkpoint]" if phase.checkpoint else ""))
            for task in self.plans.tasks_in(phase):
                phased.add(task.id)
                print(f"{task.id:>4}  {task.state:<8} {task.title}")
        loose = [t for t in self.plans.tasks_of(plan) if t.id not in phased]
        if loose:
            print("under no phase yet:")
        for task in loose:
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for plan in self.plans.in_():
            print(f"{plan.id:>4}  {plan.state:<8} {plan.title}")
        return 0
