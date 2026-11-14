from engine.query.queries import Queries
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from install.version_four.upgrade_journal import UpgradeJournal
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.fixtures.row_sequences import ROW_SEQUENCES, prepare_row_sequences
from tests.stories.fixtures.version_four import version_four_fixture


class UpgradedRowSequences(StoryFixture):
    """A fresh version 4 copy upgraded with its three built-in row sequences and one dead custom trigger."""

    def steps(self, story: Story) -> None:
        version_four_fixture(story.home.folder / "journal.db")
        prepare_row_sequences(story.home.folder)
        outcome = UpgradeJournal(story.home).run(confirmed=True)
        assert outcome.code == 0, outcome.text
        story.expect_success("suite choose coding --environment main")
        story.agent = hook_agent(story, story.hook("upgraded-main", HookSamples.session_start().with_fields(folder=str(story.home.folder.parent))))
        story.run_listeners()


def expect_preserved_sequence(story: Story, title: str) -> Sequence:
    sequence = story.container.get(Queries).query(Sequence).filter(title=title).first()
    assert sequence is not None, f"the upgrade lost {title}"
    assert sequence.id == next(number for number, sequence_title, _, _ in ROW_SEQUENCES if sequence_title == title), sequence
    return sequence


def expect_active_sequence(story: Story, title: str) -> None:
    sequence = expect_preserved_sequence(story, title)
    run = story.container.get(SequenceRunQuery).current(story.agent.id)
    assert run is not None and run.sequence_id == sequence.id, (title, run)
    story.expect_success("sequence follow", actor=story.agent)


def expect_dead_trigger_reported(story: Story) -> None:
    report = story.upgrade_text
    assert "Ship a change to Lily" in report and "trigger:1" in report and "no longer happens" in report, report
    sequence = expect_preserved_sequence(story, "Ship a change to Lily")
    assert "trigger:1" in sequence.triggers, sequence
    story.expect_text(f"sequence show {sequence.id}", "Keep these instructions.", actor=story.agent)
