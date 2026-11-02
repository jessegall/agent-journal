from core.modules.sequences.support.sequence_nudges import SEQUENCE_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.sequences.commands.abandon_sequence.abandon_sequence_subcommand import AbandonSequenceSubcommand
from core.modules.sequences.commands.follow_step.follow_step_subcommand import FollowStepSubcommand
from core.modules.sequences.commands.make_sequence.make_sequence_handler import MakeSequenceHandler
from core.modules.sequences.commands.make_sequence.make_sequence_subcommand import MakeSequenceSubcommand
from core.modules.sequences.commands.move_sequence_run.move_sequence_run_handler import MoveSequenceRunHandler
from core.modules.sequences.commands.advance_step.advance_step_subcommand import AdvanceStepSubcommand
from core.modules.sequences.commands.run_sequence.run_sequence_subcommand import RunSequenceSubcommand
from core.modules.sequences.commands.sequence_list.sequence_list_subcommand import SequenceListSubcommand
from core.modules.sequences.commands.sequence_run_list.sequence_run_list_subcommand import SequenceRunListSubcommand
from core.modules.sequences.commands.sequence_show.sequence_show_subcommand import SequenceShowSubcommand
from core.modules.sequences.listeners.sequence_row_trigger_listener import SequenceRowTriggerListener
from core.modules.sequences.migrations.m001_sequences import SequencesTablesMigration
from core.modules.sequences.migrations.m002_sequence_triggers import SequenceTriggersMigration
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.models.sequence_run_row import SequenceRunRow
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.rules.sequence_trigger_rule import SequenceTriggerRule
from core.modules.sequences.rules.step_guard_rule import StepGuardRule
from core.modules.sequences.rules.untaken_step_rule import UntakenStepRule
from core.modules.sequences.seeders.sequences_seeder import SequencesSeeder
from core.modules.sequences.upgrade.sequences_move import SequencesMove

BUILT = ["make", "show", "list"]
RUN_BUILT = [*BUILT, "edit", "delete"]


class SequencesModule(Module):
    """Adds sequences: steps an agent works through in order, taking each up before it edits, one run at a
    time."""

    name = "journal.core.sequences"
    nudges = SEQUENCE_NUDGES
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = [ModelDeclaration(Sequence, excluded_subcommands=BUILT), ModelDeclaration(SequenceRun, query=SequenceRunQuery, excluded_subcommands=RUN_BUILT)]
    migrations = [SequencesTablesMigration, SequenceTriggersMigration]
    moves = [SequencesMove]
    handlers = [MakeSequenceHandler, MoveSequenceRunHandler]
    subcommands = (MakeSequenceSubcommand, SequenceShowSubcommand, SequenceListSubcommand, SequenceRunListSubcommand, RunSequenceSubcommand, FollowStepSubcommand,
                   AdvanceStepSubcommand, AbandonSequenceSubcommand)
    views = [SequenceRunRow]
    listeners = [SequenceRowTriggerListener]
    driver_rules = [UntakenStepRule, StepGuardRule, SequenceTriggerRule]
    seeders = [SequencesSeeder]
    windows = [WindowDeclaration("sequences.sequences", "Sequences", "sequences.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, icon=WindowIcon.SEQUENCE,
                                 reads=["sequence list", "sequence show", "sequence-run list"], runs=["sequence make", "sequence edit", "sequence delete"], events=["sequence.*", "sequence_run.*"])]
