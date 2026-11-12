from engine.enums.command_category import CommandCategory
from tests.stories.core.support.agent_labels import agent_number
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.processes.hang_watch import MISSING_GROUP, FakeGroupCpuTime, watch_tick
from tests.stories.core.modules.processes.support.cadence_probe import (TICK, HelperBesideWorker, agent_run, cadence_lines, cadence_tick, expect_told,
                                                                       printed, tick_named, ticks, told, tree_of, worker_agent)
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, started_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

MAIN = "s-1"
BUILD_ALIAS = "journal build-npm --tail 5"
BUILD_START = HookSamples.shell(BUILD_ALIAS, ShellPart("journal", CommandCategory.BUILD, ["build-npm", "--tail", "5"]))


def test_a_silent_command_started_again_and_again_is_told_once_per_run_and_refused_after_two(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    heard: list[str] = []
    runs = []
    for _ in range(2):
        heard += told(story, MAIN)
        runs.append(started_run(story, BUILD_ALIAS, CommandCategory.BUILD))
        ticks(story, 70)
        end_run(story, runs[-1], "")
    heard += told(story, MAIN)
    refused = story.hook(MAIN, BUILD_START)
    heard += list(refused.lines)
    story.expect_rows(sum("alias build-npm printed nothing for 30 seconds" in line for line in heard) == len(runs), "ran silent twice" in refused.refusal,
                      detail="\n".join([*heard, refused.refusal]))


def test_a_dot_every_25_seconds_added_to_quiet_the_notice_and_a_program_printing_only_whitespace_count_as_streaming(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    dotted = moved_run(story, "npx jest", CommandCategory.TEST_RUN)
    blank = moved_run(story, "make blank", CommandCategory.BUILD)
    story.expect_success(f'output title {dotted.id} "Running the jest tests"', actor=story.agent)
    ticks(story, 30, blank, every=10, text="   \n")
    expect_told(story, MAIN, f"output {dotted.id} printed nothing for 30 seconds, so its output is not streaming: run jest with --verbose")
    dots = ""
    for elapsed in range(10, 280, 10):
        if elapsed % 25 < 10:
            dots += "."
            printed(story, dotted, dots)
        ticks(story, 10, blank, every=10, text="   \n")
    lines = cadence_lines(told(story, MAIN))
    story.expect_rows(lines == [], detail="\n".join(lines))


def test_a_workers_long_silent_build_is_told_and_warned_but_never_asked_the_five_minute_check(new_story):
    story = new_story(fixture=HelperBesideWorker)
    worker = worker_agent(story)
    build = agent_run(story, worker, "make release", CommandCategory.BUILD)
    tree = FakeGroupCpuTime(12.0)
    tree_of(story, tree, MISSING_GROUP, build)
    watch_tick(story)
    for step in range(1, 33):
        story.advance(TICK)
        tree.used += 1 if step > 16 else 0
        watch_tick(story)
        cadence_tick(story)
        tick_named(story, "output checks")
    lines = told(story, worker.session)
    story.expect_rows(any(f"output {build.id} printed nothing for 30 seconds" in line for line in lines),
                      any(f"output {build.id} printed nothing for 150 s and uses no processor time" in line for line in lines),
                      not any("still runs after" in line for line in lines), detail="\n".join(lines))
    story.expect_success(f"process show {build.id}", actor=story.agent)
    story.expect_success(f"process-part list --process {build.id}", actor=story.agent)
    story.expect_success(f"process holds --agent {agent_number(story, worker.id)}", actor=story.agent)
