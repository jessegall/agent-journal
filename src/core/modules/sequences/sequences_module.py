from core.modules.sequences.declarations.sequences_dependencies import SEQUENCES_DEPENDENCIES
from core.modules.sequences.declarations.sequences_migrations import SEQUENCES_MIGRATIONS
from core.modules.sequences.declarations.sequences_subcommands import SEQUENCES_SUBCOMMANDS
from core.modules.sequences.declarations.sequences_listeners import SEQUENCES_LISTENERS
from core.modules.sequences.policies.step_command_policy import StepCommandPolicy
from core.modules.sequences.policies.step_guard_policy import StepGuardPolicy
from core.modules.sequences.states.unstarted_step_states import UnstartedStepStates
from core.modules.sequences.lines.sequence_trigger_lines import SequenceTriggerLines
from core.modules.sequences.effects.sequence_trigger_effect import SequenceTriggerEffect
from core.modules.sequences.windows.sequences_windows import SEQUENCES_WINDOWS
from core.modules.sequences.models.declarations.sequence_model_declaration import SequenceModelDeclaration
from core.modules.sequences.models.declarations.sequence_run_model_declaration import SequenceRunModelDeclaration
from core.modules.sequences.skills.declarations.sequences_skills import SEQUENCES_SKILLS
from core.modules.sequences.support.sequence_agent_messages import SEQUENCE_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.sequences.commands.make_sequence.make_sequence_handler import MakeSequenceHandler
from core.modules.sequences.commands.move_sequence_run.move_sequence_run_handler import MoveSequenceRunHandler
from core.modules.sequences.commands.save_standard_sequences.save_standard_sequences_handler import SaveStandardSequencesHandler
from core.modules.sequences.guards.standard_sequence_guard import StandardSequenceGuard
from core.modules.sequences.models.sequence_run_row import SequenceRunRow
from core.modules.sequences.shares.sequence_library_share import SequenceLibraryShare
from core.modules.sequences.guards.step_condition_name_guard import StepConditionNameGuard
from core.modules.sequences.guards.plan_being_built_guard import PlanBeingBuiltGuard
from core.modules.sequences.seeders.sequences_seeder import SequencesSeeder
from core.modules.sequences.upgrade.sequences_move import SequencesMove
from core.modules.sequences.marks.sequence_mark import SequenceMark
from engine.driver.stop_blockers import StopBlockers
from core.modules.sequences.support.sequence_step_started import SequenceStepStarted
from core.modules.sequences.support.sequence_stop_blockers import SequenceStopBlockers

from core.modules.sequences.states.sequence_work_states import SequenceWorkStates


class SequencesModule(Module):
    """Adds sequences: steps an agent works through in order, taking each up before it edits, one run at a
    time."""

    name = "journal.core.sequences"
    effects = [SequenceTriggerEffect]
    lines = [SequenceTriggerLines]
    states = [UnstartedStepStates, SequenceWorkStates]
    policies = [StepCommandPolicy, StepGuardPolicy]
    agent_messages = SEQUENCE_AGENT_MESSAGES
    requires_engine = ">=5,<6"
    dependencies = SEQUENCES_DEPENDENCIES
    block_conditions = [SequenceStepStarted]
    bindings = {StopBlockers: SequenceStopBlockers}
    skills = SEQUENCES_SKILLS
    library_shares = [SequenceLibraryShare]
    models = [SequenceModelDeclaration, SequenceRunModelDeclaration]
    migrations = SEQUENCES_MIGRATIONS
    moves = [SequencesMove]
    handlers = [MakeSequenceHandler, MoveSequenceRunHandler, SaveStandardSequencesHandler]
    guards = [StandardSequenceGuard, StepConditionNameGuard, PlanBeingBuiltGuard]
    subcommands = SEQUENCES_SUBCOMMANDS
    views = [SequenceRunRow]
    listeners = SEQUENCES_LISTENERS
    marks = [SequenceMark]
    seeders = [SequencesSeeder]
    windows = SEQUENCES_WINDOWS
