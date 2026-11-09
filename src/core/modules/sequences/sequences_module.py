from core.modules.sequences.migrations.m008_sequence_session import SequenceSessionMigration
from core.modules.sequences.migrations.m007_open_run_order_index import OpenRunOrderIndexMigration
from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.sequences.support.sequence_nudges import SEQUENCE_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.sequences.listeners.sequence_event_index_listener import SequenceEventIndexListener
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_key import WindowKey
from core.base.viewer.window_place import WindowPlace
from core.modules.sequences.commands.abandon_sequence.abandon_sequence_subcommand import AbandonSequenceSubcommand
from core.modules.sequences.commands.follow_step.follow_step_subcommand import FollowStepSubcommand
from core.modules.sequences.commands.make_sequence.make_sequence_handler import MakeSequenceHandler
from core.modules.sequences.commands.make_sequence.make_sequence_subcommand import MakeSequenceSubcommand
from core.modules.sequences.commands.move_sequence_run.move_sequence_run_handler import MoveSequenceRunHandler
from core.modules.sequences.commands.advance_step.advance_step_subcommand import AdvanceStepSubcommand
from core.modules.sequences.commands.run_sequence.run_sequence_subcommand import RunSequenceSubcommand
from core.modules.sequences.commands.sequence_list.sequence_list_subcommand import SequenceListSubcommand
from core.modules.sequences.commands.sequence_board.sequence_board_subcommand import SequenceBoardSubcommand
from core.modules.sequences.commands.sequence_run_list.sequence_run_list_subcommand import SequenceRunListSubcommand
from core.modules.sequences.commands.sequence_show.sequence_show_subcommand import SequenceShowSubcommand
from core.modules.sequences.commands.save_standard_sequences.save_standard_sequences_handler import SaveStandardSequencesHandler
from core.modules.sequences.guards.standard_sequence_guard import StandardSequenceGuard
from core.modules.sequences.listeners.sequence_row_trigger_listener import SequenceRowTriggerListener
from core.modules.sequences.listeners.sequence_end_listener import SequenceEndListener
from core.modules.sequences.listeners.sequence_started_mark_listener import SequenceStartedMarkListener
from core.modules.sequences.listeners.sequence_ended_mark_listener import SequenceEndedMarkListener
from core.modules.sequences.listeners.standard_sequences_listener import StandardSequencesListener
from core.modules.sequences.migrations.m001_sequences import SequencesTablesMigration
from core.modules.sequences.migrations.m002_sequence_triggers import SequenceTriggersMigration
from core.modules.sequences.migrations.m003_trigger_event import TriggerEventMigration
from core.modules.sequences.migrations.m004_close_legacy_step_blocks import CloseLegacyStepBlocksMigration
from core.modules.sequences.migrations.m005_run_subject import RunSubjectMigration
from core.modules.sequences.migrations.m006_open_run_subject_index import OpenRunSubjectIndexMigration
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.models.sequence_run_row import SequenceRunRow
from core.modules.sequences.queries.sequence_query import SequenceQuery
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.shares.sequence_library_share import SequenceLibraryShare
from core.modules.sequences.rules.sequence_trigger_rule import SequenceTriggerRule
from core.modules.sequences.rules.step_guard_rule import StepGuardRule
from core.modules.sequences.rules.unstarted_step_rule import UnstartedStepRule
from core.modules.sequences.seeders.sequences_seeder import SequencesSeeder
from core.modules.sequences.upgrade.sequences_move import SequencesMove
from core.modules.sequences.support.sequence_marks import SEQUENCE_MARKS
from core.modules.sequences.support.skeletons import SEQUENCES_SEQUENCES_SKELETON
from core.modules.sequences.support.sequence_step_started import SequenceStepStarted

BUILT = ["make", "show", "list"]
RUN_BUILT = [*BUILT, "edit", "delete"]


class SequencesModule(Module):
    """Adds sequences: steps an agent works through in order, taking each up before it edits, one run at a
    time."""

    name = "journal.core.sequences"
    nudges = SEQUENCE_NUDGES
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.chat", "journal.core.documents"]
    block_conditions = [SequenceStepStarted]
    skills = [SkillDeclaration("journal-sequences", "Follow a sequence of steps one at a time; read it when a sequence is run or written", keywords=("sequence", "sequences"), commands=["sequence"])]
    library_shares = [SequenceLibraryShare]
    models = [ModelDeclaration(Sequence, query=SequenceQuery, excluded_subcommands=BUILT), ModelDeclaration(SequenceRun, query=SequenceRunQuery, excluded_subcommands=RUN_BUILT)]
    migrations = [SequenceSessionMigration, OpenRunOrderIndexMigration, SequencesTablesMigration, SequenceTriggersMigration, TriggerEventMigration, CloseLegacyStepBlocksMigration, RunSubjectMigration, OpenRunSubjectIndexMigration]
    moves = [SequencesMove]
    handlers = [MakeSequenceHandler, MoveSequenceRunHandler, SaveStandardSequencesHandler]
    guards = [StandardSequenceGuard]
    subcommands = [MakeSequenceSubcommand, SequenceShowSubcommand, SequenceListSubcommand, SequenceBoardSubcommand, SequenceRunListSubcommand, RunSequenceSubcommand, FollowStepSubcommand,
                   AdvanceStepSubcommand, AbandonSequenceSubcommand]
    views = [SequenceRunRow]
    listeners = [SequenceEventIndexListener, SequenceRowTriggerListener, SequenceEndListener, StandardSequencesListener, SequenceStartedMarkListener, SequenceEndedMarkListener]
    marks = SEQUENCE_MARKS
    driver_rules = [UnstartedStepRule, StepGuardRule, SequenceTriggerRule]
    seeders = [SequencesSeeder]
    windows = [WindowDeclaration("sequences.sequences", "Sequences", "sequences.js", WindowLoading.COMPONENT, skeleton=SEQUENCES_SEQUENCES_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.SEQUENCE,
                                 reads=["sequence list", "sequence show", "sequence-run list", "sequence board"], keys=[WindowKey("board", "sequence board", events=["sequence.*", "sequence_run.*"])], runs=["sequence make", "sequence edit", "sequence delete"], events=["sequence.*", "sequence_run.*"])]
