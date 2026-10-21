from argparse import Namespace
from dataclasses import replace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.plans.support.review_rounds import ReviewRounds
from journal.features.tasks.support.waits import Waits
from journal.features.workers.support.subagent_entries import SubagentEntries
from journal.models.link import Link
from journal.models.phase import Phase
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.repositories.links import Links
from journal.support.rejection import Rejection
from journal.repositories.phases import Phases
from journal.repositories.plans import PHASE_LINK, PLAN_LINK, PHASE_TASK_LINK, Plans
from journal.repositories.tasks import Tasks


class PlanCommand(Command):
    noun = "plan"

    def __init__(self, plans: Plans, phases: Phases, tasks: Tasks, links: Links, subagents: SubagentEntries, waits: Waits, rounds: ReviewRounds) -> None:
        self.plans, self.phases, self.tasks, self.links, self.subagents, self.waits = plans, phases, tasks, links, subagents, waits
        self.rounds = rounds

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", "draft a plan")
        creation.add_argument("title")
        creation.add_argument("--brief", default="")
        addition = self.verb(verbs, "add", "add a task to a plan, after the ones it has")
        addition.add_argument("n", type=int)
        addition.add_argument("title")
        addition.add_argument("--brief", default="")
        addition.add_argument("--first", action="store_true", help="put it before the tasks the plan has")
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
        removal = self.verb(verbs, "remove", "take tasks out of a plan and its phases; they stay open as tasks of their own")
        removal.add_argument("n", type=int)
        removal.add_argument("tasks", type=int, nargs="+")
        ready = self.verb(verbs, "ready", "the plan is built: every phase has its tasks, and the user may approve it")
        ready.add_argument("n", type=int)
        ready.add_argument("--changed", help="after a review: what the round changed in the plan, in one line (tasks added, merged, moved, reworded)")
        self.verb(verbs, "review", "reviewers are reading the plan: it cannot be approved until they are back and their findings are in it").add_argument("n", type=int)
        self.verb(verbs, "approve", "the user's word: the plan may start").add_argument("n", type=int)
        self.verb(verbs, "start", "follow an approved plan, or go on past a checkpoint: its next open task is started").add_argument("n", type=int)
        self.verb(verbs, "suspend", "put a plan aside").add_argument("n", type=int)
        block = self.verb(verbs, "block", "a started plan waits on one thing before any of its work can go on; a plan whose every task left is blocked blocks itself")
        block.add_argument("n", type=int)
        block.add_argument("why", nargs="?", default="")
        Waits.arguments(block, "plan")
        self.verb(verbs, "unblock", "what the plan waited on came: it is started again").add_argument("n", type=int)
        self.verb(verbs, "cancel", "a plan given up, with the tasks that are its alone; one another live plan holds stays").add_argument("n", type=int)
        self.verb(verbs, "show", "a plan and its tasks").add_argument("n", type=int)
        self.verb(verbs, "list", "every plan here")

    def create(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.save(Plan(title=args.title, brief=args.brief), caller.actor)
        print(f"plan {plan.id} {plan.state}")
        return 0

    def add(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        previous = self.plans.plan_tasks(plan) if args.first else []
        task = self.tasks.save(Task(environment_id=plan.environment_id, title=args.title, brief=args.brief), caller.actor)
        self.links.save(Link(source=Ref.build(task), target=Ref.build(plan), kind=PLAN_LINK), caller.actor)
        for counterpart in previous:
            self.relink(counterpart, plan, caller)
        print(f"task {task.id} added to plan {plan.id}{' first' if args.first else ''}")
        return 0

    def relink(self, task: Task, plan: Plan, caller: Caller) -> None:
        for link in self.links.connecting(task, plan):
            self.links.delete(link, caller.actor)
        self.links.save(Link(source=Ref.build(task), target=Ref.build(plan), kind=PLAN_LINK), caller.actor)

    def rephase(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        phase = self.plans.plan_phases(plan)[args.phase - 1]
        changed = phase.with_(title=args.title or phase.title, completion_rule=args.when or phase.completion_rule)
        self.phases.save(changed, caller.actor)
        print(f"phase {args.phase} of plan {plan.id} is now: {changed.title}")
        return 0

    def phase(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        phase = self.phases.save(Phase(environment_id=plan.environment_id, title=args.title, completion_rule=args.when, checkpoint=args.checkpoint), caller.actor)
        self.links.save(Link(source=Ref.build(phase), target=Ref.build(plan), kind=PHASE_TASK_LINK), caller.actor)
        print(f"phase {len(self.plans.plan_phases(plan))} of plan {plan.id}")
        return 0

    def todos(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        phases = self.plans.plan_phases(plan)
        if not 1 <= args.phase <= len(phases):
            raise Rejection(f"plan {plan.id} has {len(phases)} phases: name one by its number from 1")
        phase = phases[args.phase - 1]
        for n in args.tasks:
            task = self.tasks.find(n)
            if not self.links.connecting(task, plan):
                self.links.save(Link(source=Ref.build(task), target=Ref.build(plan), kind=PLAN_LINK), caller.actor)
            for link in [link for counterpart in phases for link in self.links.connecting(task, counterpart)]:
                self.links.delete(link, caller.actor)
            self.links.save(Link(source=Ref.build(task), target=Ref.build(phase), kind=PHASE_LINK), caller.actor)
        print(f"tasks {', '.join(str(n) for n in args.tasks)} under phase {args.phase} of plan {plan.id}")
        return 0

    def remove(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        counterparts = [plan, *self.plans.plan_phases(plan)]
        for n in args.tasks:
            task = self.tasks.find(n)
            for link in [link for counterpart in counterparts for link in self.links.connecting(task, counterpart)]:
                self.links.delete(link, caller.actor)
        print(f"tasks {', '.join(str(n) for n in args.tasks)} taken out of plan {plan.id}")
        return 0

    def ready(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        phases = self.plans.plan_phases(plan)
        if not phases:
            raise Rejection(f"plan {plan.id} has no phase yet: journal plan phase {plan.id} \"<title>\" --when \"<complete when>\"")
        empty = [i for i, phase in enumerate(phases, 1) if not self.plans.phase_tasks(phase)]
        if empty:
            raise Rejection(f"phase {', '.join(str(i) for i in empty)} of plan {plan.id} has no task yet: journal plan todos {plan.id} <phase> <tasks>")
        output = self.subagents.running_mentioning(caller.session, f"plan {plan.id}") if plan.state == PlanState.REVIEWING and caller.session is not None else 0
        if output:
            raise Rejection(f"plan {plan.id} is in review and {output} of its reviewers are still out: wait for them, put what they found into the plan, then ready it")
        if plan.state == PlanState.REVIEWING:
            self.close_round(plan, args.changed, caller)
        plan = self.plans.save(plan.ready(), caller.actor)
        print(f"plan {plan.id} ready: the user approves it on the plan page")
        return 0

    def close_round(self, plan: Plan, changed: str | None, caller: Caller) -> None:
        if changed is None:
            raise Rejection(f"plan {plan.id} is in review: say in one line what this round changed, journal plan ready {plan.id} --changed \"<tasks added, merged, moved, reworded>\"")
        self.rounds.close(plan, changed, caller)

    def review(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.save(self.plans.find(args.n).reviewing(), caller.actor)
        self.rounds.open(plan, caller.actor)
        print(f"plan {args.n} in review: put what the reviewers find straight into it, then journal plan ready {args.n}")
        return 0

    def approve(self, args: Namespace, caller: Caller) -> int:
        if not caller.actor.is_user():
            raise Rejection("only the user approves a plan: ask, then wait for their word")
        plan = self.plans.approve(self.plans.find(args.n), caller.actor)
        print(f"plan {plan.id} {plan.state}")
        return 0

    def start(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.start(self.plans.find(args.n), caller.actor)
        current = self.plans.started_task(plan)
        print(f"plan {plan.id} {plan.state}" + (f": task {current.id}, {current.title} is started" if current else ""))
        return 0

    def block(self, args: Namespace, caller: Caller) -> int:
        self.waits.refuse_unnamed(args.why, args.on, args.until)
        plan = self.plans.save(self.plans.find(args.n).blocked(args.why, datetime.now(timezone.utc).timestamp()), caller.actor)
        self.waits.linked(plan, args.on, args.until, args.every, caller.actor)
        print(f"plan {plan.id} blocked, waiting on: {self.tasks.reason(plan)}")
        return 0

    def unblock(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.save(self.plans.find(args.n).unblocked("the user opened it", datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"plan {plan.id} open again: `journal plan start {plan.id}` goes on with it")
        return 0

    def suspend(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.postpone(self.plans.find(args.n), caller.actor)
        print(f"plan {plan.id} parked")
        return 0

    def cancel(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        cancelled = self.plans.cancel(plan, caller.actor)
        print(f"plan {plan.id} cancelled" + (f", with tasks {', '.join(str(t.id) for t in cancelled)}" if cancelled else ""))
        return 0

    def brief(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.save(replace(self.plans.find(args.n), brief=args.text), caller.actor)
        print(f"plan {plan.id} brief set")
        return 0

    def show(self, args: Namespace, caller: Caller) -> int:
        plan = self.plans.find(args.n)
        print(f"plan {plan.id} {plan.state}: {plan.title}")
        phased = set()
        for i, phase in enumerate(self.plans.plan_phases(plan), 1):
            print(f"phase {i}: {phase.title}" + (f" (complete when {phase.completion_rule})" if phase.completion_rule else "") + (" [checkpoint]" if phase.checkpoint else ""))
            for task in self.plans.phase_tasks(phase):
                phased.add(task.id)
                print(f"{task.id:>4}  {task.state:<8} {task.title}")
        loose = [t for t in self.plans.plan_tasks(plan) if t.id not in phased]
        if loose:
            print("under no phase yet:")
        for task in loose:
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for plan in self.plans.scoped():
            print(f"{plan.id:>4}  {plan.state:<8} {plan.title}")
        return 0
