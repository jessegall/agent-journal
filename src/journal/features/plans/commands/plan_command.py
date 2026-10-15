from argparse import Namespace
from dataclasses import replace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.plans.states.following_plan import FollowingPlan
from journal.models.link import Link
from journal.models.plan import Plan
from journal.models.ref import Ref
from journal.models.task import Task
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.plans import IN_PLAN, Plans
from journal.repositories.tasks import Tasks


class PlanCommand(Command):
    noun = "plan"

    def __init__(self, plans: Plans, tasks: Tasks, links: Links, environments: Environments, machine: Machine) -> None:
        self.plans, self.tasks, self.links, self.environments, self.machine = plans, tasks, links, environments, machine

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "draft a plan")
        create.add_argument("title")
        create.add_argument("--brief", default="")
        add = self.verb(verbs, "add", "add a task to a plan, after the ones it has")
        add.add_argument("n", type=int)
        add.add_argument("title")
        add.add_argument("--brief", default="")
        brief = self.verb(verbs, "brief", "set a plan's goal, what is true when it is done")
        brief.add_argument("n", type=int)
        brief.add_argument("text")
        self.verb(verbs, "start", "follow a plan: its first open task is started").add_argument("n", type=int)
        self.verb(verbs, "park", "put a plan aside").add_argument("n", type=int)
        self.verb(verbs, "show", "a plan and its tasks").add_argument("n", type=int)
        self.verb(verbs, "list", "every plan here")

    def create(self, args: Namespace, where: Where) -> int:
        plan = self.plans.save(Plan(environment_id=self.environments.named(where.environment).id, title=args.title, brief=args.brief), where.actor)
        print(f"plan {plan.id} {plan.state}: {plan.title}")
        return 0

    def add(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        task = self.tasks.save(Task(environment_id=plan.environment_id, title=args.title, brief=args.brief), where.actor)
        self.links.save(Link(source=Ref.to(task), target=Ref.to(plan), kind=IN_PLAN), where.actor)
        print(f"task {task.id} added to plan {plan.id}: {task.title}")
        return 0

    def start(self, args: Namespace, where: Where) -> int:
        from journal.features.plans.feature import Plans as PlansFeature
        plan = self.plans.save(self.plans.find(args.n).started(), where.actor)
        task = self.plans.next_task(plan)
        if task is None:
            print(f"plan {plan.id} has no open task")
            return 1
        started = self.tasks.save(task.started(datetime.now(timezone.utc)), where.actor)
        if where.session:
            self.machine.move(where.session, plan.environment_id, FollowingPlan(plan_id=plan.id, task_id=started.id))
        print(PlansFeature.NEXT.about(n=plan.id, task=started.id, title=started.title).rendered())
        return 0

    def park(self, args: Namespace, where: Where) -> int:
        plan = self.plans.save(self.plans.find(args.n).parked(), where.actor)
        print(f"plan {plan.id} parked")
        return 0

    def brief(self, args: Namespace, where: Where) -> int:
        plan = self.plans.save(replace(self.plans.find(args.n), brief=args.text), where.actor)
        print(f"plan {plan.id} brief set: {plan.title}")
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        plan = self.plans.find(args.n)
        print(f"plan {plan.id} {plan.state}: {plan.title}")
        for task in self.plans.tasks_of(plan):
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for plan in self.plans.in_(self.environments.named(where.environment).id):
            print(f"{plan.id:>4}  {plan.state:<8} {plan.title}")
        return 0
