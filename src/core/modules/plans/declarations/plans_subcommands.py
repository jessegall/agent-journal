from core.modules.plans.commands.assign_plan.assign_plan_subcommand import AssignPlanSubcommand
from core.modules.plans.commands.check_plan.check_plan_subcommand import CheckPlanSubcommand
from core.modules.plans.commands.choose_plan_focus.choose_plan_focus_subcommand import ChoosePlanFocusSubcommand
from core.modules.plans.commands.make_phase.make_phase_subcommand import MakePhaseSubcommand
from core.modules.plans.commands.make_planned_task.make_task_subcommand import MakeTaskSubcommand
from core.modules.plans.commands.move_phase.move_phase_subcommand import MovePhaseSubcommand
from core.modules.plans.commands.place_phase.place_phase_subcommand import PlacePhaseSubcommand
from core.modules.plans.commands.plan_board.plan_board_subcommand import PlanBoardSubcommand
from core.modules.plans.commands.plan_inspect.plan_inspect_subcommand import PlanInspectSubcommand
from core.modules.plans.commands.plan_outline.plan_outline_subcommand import PlanOutlineSubcommand
from core.modules.plans.commands.plan_place.plan_place_subcommand import PlanPlaceSubcommand
from core.modules.plans.commands.plan_places.plan_places_subcommand import PlanPlacesSubcommand
from core.modules.plans.commands.plan_progress.plan_progress_subcommand import PlanProgressSubcommand
from core.modules.plans.commands.plan_timeline.plan_timeline_subcommand import PlanTimelineSubcommand
from core.modules.plans.commands.wait_plan.wait_plan_subcommand import WaitPlanSubcommand

PLANS_SUBCOMMANDS = [CheckPlanSubcommand, WaitPlanSubcommand, AssignPlanSubcommand, ChoosePlanFocusSubcommand, PlanTimelineSubcommand, PlanBoardSubcommand, PlanPlacesSubcommand, PlanOutlineSubcommand, PlanPlaceSubcommand, PlanInspectSubcommand, MakePhaseSubcommand, MovePhaseSubcommand,
                   PlacePhaseSubcommand, PlanProgressSubcommand, MakeTaskSubcommand]
