from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.sequences.commands.abandon_sequence_subcommand import AbandonSequenceSubcommand
from core.modules.sequences.commands.follow_step_subcommand import FollowStepSubcommand
from core.modules.sequences.commands.make_sequence_handler import MakeSequenceHandler
from core.modules.sequences.commands.make_sequence_subcommand import MakeSequenceSubcommand
from core.modules.sequences.commands.move_sequence_run_handler import MoveSequenceRunHandler
from core.modules.sequences.commands.next_step_subcommand import NextStepSubcommand
from core.modules.sequences.commands.run_sequence_subcommand import RunSequenceSubcommand
from core.modules.sequences.commands.sequence_list_subcommand import SequenceListSubcommand
from core.modules.sequences.commands.sequence_show_subcommand import SequenceShowSubcommand
from core.modules.sequences.migrations.m001_sequences import SequencesTablesMigration
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.rules.untaken_step_rule import UntakenStepRule
from core.modules.sequences.seeders.sequences_seeder import SequencesSeeder
from core.modules.sequences.upgrade.sequences_move import SequencesMove

BUILT = ["make", "edit", "show", "list", "delete"]


class SequencesModule(Module):
    """Adds sequences: steps an agent works through in order, taking each up before it edits, one run at a time."""

    name = "journal.core.sequences"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = [ModelDeclaration(Sequence, excluded_subcommands=BUILT), ModelDeclaration(SequenceRun, query=SequenceRunQuery, excluded_subcommands=BUILT)]
    migrations = [SequencesTablesMigration]
    moves = [SequencesMove]
    handlers = [MakeSequenceHandler, MoveSequenceRunHandler]
    subcommands = (MakeSequenceSubcommand, SequenceShowSubcommand, SequenceListSubcommand, RunSequenceSubcommand, FollowStepSubcommand, NextStepSubcommand,
                   AbandonSequenceSubcommand)
    driver_rules = [UntakenStepRule]
    seeders = [SequencesSeeder]
    windows = [WindowDeclaration("sequences.sequences", "Sequences", "sequences.js", WindowLoading.COMPONENT, icon=WindowIcon.SEQUENCE,
                                 reads=["sequence list", "sequence show"], events=["sequence.*"])]
