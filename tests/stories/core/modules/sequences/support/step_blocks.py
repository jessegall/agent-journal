from engine.command.bus import Bus
from engine.database.database import Database
from engine.database.module_migrations import ModuleMigrations
from engine.database.schema import Schema
from engine.database.statement import Statement
from engine.driver.block_until import BlockUntil
from engine.driver.command_category import CommandCategory
from engine.driver.conditions.ran_command import RanCommand
from engine.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.block_conditions.any_condition import AnyCondition
from core.modules.sequences.sequences_module import SequencesModule
from core.modules.sequences.support.sequence_nudges import STEP_WAITS, STEP_EDIT_BAN
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart


def run_with_hook(story, command: str) -> None:
    sample = HookSamples.shell(f"journal {command}", ShellPart("journal", CommandCategory.JOURNAL, command.split(), subcommand="sequence"))
    answer = story.hook("s-1", sample)
    assert not answer.refusal, answer
    story.expect_success(command, actor=story.agent)


def expect_tools_allowed(story) -> None:
    for sample in [HookSamples.edit("cart.py"), HookSamples.shell("printf ready", ShellPart("printf", CommandCategory.UNKNOWN, ["ready"]))]:
        answer = story.hook("s-1", sample)
        assert not answer.refusal, answer


def repair_legacy_blocks(story) -> None:
    bus = story.container.get(Bus)
    condition = AnyCondition(RanCommand("journal sequence follow"), RanCommand("journal sequence abandon"))
    legacy = bus.run(BlockUntil(story.agent.id, STEP_WAITS.nudge(sequence=1, step=1), condition), story.agent)
    edit_block = bus.run(BlockUntil(story.agent.id, STEP_EDIT_BAN.nudge(sequence=1, step=1), RanCommand("journal overview")), story.agent)
    database = story.container.get(Database)
    database.update(Statement("DELETE FROM migrations WHERE module = ? AND number > 3", [SequencesModule.name]))
    schema = story.container.get(Schema)
    migrations = [ModuleMigrations(SequencesModule.name, [migration() for migration in SequencesModule.migrations if migration.number <= 4])]
    assert schema.migrate(migrations) == [f"{SequencesModule.name} 4"]
    query = story.container.get(Queries).query(AgentBlock)
    assert query.find(legacy.id).closed_at is not None
    assert query.find(edit_block.id).closed_at is None
    assert schema.migrate(migrations) == []
