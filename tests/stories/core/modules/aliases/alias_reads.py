from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.read_limit import limit_reads
from tests.stories.core.support.seeds.large_read_seeds import SavedBuildSeed
from tests.stories.server.support.go_build import GoBuild

SAVED_BUILDS = 60
LAST_BUILD = HookSamples.shell("builder59 all", ShellPart("builder59", CommandCategory.BUILD, ["all"]), has_saved_commands=True)


def test_a_build_written_out_is_told_its_saved_command_among_sixty_saved_builds_within_the_read_limit(new_story):
    story = new_story(fixture=BuilderStarted)
    binary = story.home.folder / "bin" / "journal-hook"
    binary.parent.mkdir(parents=True, exist_ok=True)
    GoBuild.built("journal-hook", binary)
    for number in range(SAVED_BUILDS):
        story.expect_success(f'alias add build-{number:02d} "builder{number:02d} all" --category build', actor=story.agent)
    limit_reads(story)
    story.expect_hook_refusal("s-1", LAST_BUILD, "This is a saved command: run journal build-59")


SEEDED_BUILDS = 336


def test_alias_edit_with_336_aliases_reads_no_statement_over_51_rows_and_still_refuses_a_conflict(new_story):
    story = new_story(fixture=BuilderStarted)
    story.seed(SavedBuildSeed, SEEDED_BUILDS)
    binary = story.home.folder / "bin" / "journal-hook"
    binary.parent.mkdir(parents=True, exist_ok=True)
    GoBuild.built("journal-hook", binary)
    limit_reads(story)
    story.expect_refusal('alias add second-build "cd seeded/package_200 && make all" --category build', "this program and target already use journal seeded-build-200",
                         actor=story.agent)
    story.expect_refusal('alias edit seeded-build-100 --line "cd seeded/package_200 && make all"', "this program and target already use journal seeded-build-200",
                         actor=story.agent)
