from core.base.module.module import Module
from core.base.module.noun import Noun
from core.base.registry.dotted_path import DottedPath
from core.plans.phase import Phase
from core.plans.phase_task import PhaseTask
from core.plans.plan import Plan

PLAN_COMMANDS = tuple(f"core.plans.commands:{name}" for name in ("PlanPause", "PlanBlock", "PlanCancel"))


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "plans"
    requires_core = ">=5,<6"
    dependencies = ("actors", "environments", "agents", "tasks")
    nouns = (Noun(Plan, query=DottedPath("core.plans.plan_query:PlanQuery"), commands=PLAN_COMMANDS), Noun(Phase), Noun(PhaseTask))
    migrations = ("core.plans.migrations.m001_plans:PlansTables",)
    handlers = ("core.plans.phase_handlers:PhaseMakeHandler", "core.plans.phase_handlers:PhaseMoveHandler", "core.plans.phase_handlers:PhasePlaceHandler")
    subcommands = ("core.plans.phase_subcommands:PhaseMakeSubcommand", "core.plans.phase_subcommands:PhaseMoveSubcommand",
                   "core.plans.phase_subcommands:PhasePlaceSubcommand", "core.plans.plan_progress:PlanProgressSubcommand")
    views = ("core.plans.views:PLAN_PROGRESS",)
    listeners = ("core.plans.listeners.forget_place:ForgetPlace", "core.plans.listeners.cancel_open_plan_tasks:CancelOpenPlanTasks",
                 "core.plans.listeners.next_plan_task_starter:NextPlanTaskStarter")
