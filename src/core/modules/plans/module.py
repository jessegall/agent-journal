from core.base.module.module import Module
from core.base.module.noun import Noun
from core.base.registry.dotted_path import DottedPath
from core.modules.plans.phase import Phase
from core.modules.plans.phase_task import PhaseTask
from core.modules.plans.plan import Plan

PLAN_COMMANDS = tuple(f"core.modules.plans.commands:{name}" for name in ("PlanPause", "PlanBlock", "PlanCancel"))


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "plans"
    requires_core = ">=5,<6"
    dependencies = ("actors", "environments", "agents", "tasks")
    nouns = (Noun(Plan, query=DottedPath("core.modules.plans.plan_query:PlanQuery"), commands=PLAN_COMMANDS), Noun(Phase), Noun(PhaseTask))
    migrations = ("core.modules.plans.migrations.m001_plans:PlansTables",)
    handlers = ("core.modules.plans.phase_handlers:PhaseMakeHandler", "core.modules.plans.phase_handlers:PhaseMoveHandler", "core.modules.plans.phase_handlers:PhasePlaceHandler")
    subcommands = ("core.modules.plans.phase_subcommands:PhaseMakeSubcommand", "core.modules.plans.phase_subcommands:PhaseMoveSubcommand",
                   "core.modules.plans.phase_subcommands:PhasePlaceSubcommand", "core.modules.plans.plan_progress:PlanProgressSubcommand")
    views = ("core.modules.plans.views:PLAN_PROGRESS",)
    listeners = ("core.modules.plans.listeners.forget_place:ForgetPlace", "core.modules.plans.listeners.cancel_open_plan_tasks:CancelOpenPlanTasks",
                 "core.modules.plans.listeners.next_plan_task_starter:NextPlanTaskStarter")
