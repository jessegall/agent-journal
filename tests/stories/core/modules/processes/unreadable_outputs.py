from engine.actor.actor import Actor
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.cadence_probe import kept_lines, ticks
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.modules.processes.support.reading_scenarios import LONG_RUN, STEPS, ended_after_a_while, heard
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from core.modules.processes.support.process_nudges import UNREADABLE_DECLARED
from core.modules.processes.support.process_nudges import UNREADABLE_LIFTED
from engine.testing.expectations.expect_nudge import said

SPINNER = "\r[###] working" * 1000


def test_an_agent_marks_a_command_unreadable_only_with_a_reason_of_three_words_and_lifts_the_mark(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_refusal('reader unreadable "make watch" --reason "spinner only"', "at least three words", actor=story.agent)
    story.expect_success('reader unreadable "make  watch" --reason "prints only a spinner"', actor=story.agent)
    story.expect_text("unreadable-mark show 1", "words: make watch", "reason: declared", "note: prints only a spinner", f"creator_id: {story.agent.id}", actor=story.agent)
    story.expect_success('reader readable "make watch"', actor=story.agent)
    story.expect_text("unreadable-mark show 1", f"lifter_id: {story.agent.id}", "lifted_at: ", actor=story.agent)
    story.expect_refusal('reader readable "make watch"', "no command make watch is marked unreadable", actor=story.agent)


def test_two_runs_that_redraw_one_line_mark_their_command_once_and_two_readable_runs_lift_the_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success("unreadable-mark list", "nothing found", actor=story.agent)
    first = ended_after_a_while(story, moved_run(story, "make spin", CommandCategory.BUILD), SPINNER)
    second = ended_after_a_while(story, moved_run(story, "make spin", CommandCategory.BUILD), SPINNER)
    marked = heard(story)
    story.expect_text("unreadable-mark show 1", "words: make spin", "reason: single line", f"creator_id: {Actor.core().id}", actor=story.agent)
    for _ in range(2):
        ended_after_a_while(story, moved_run(story, "make spin", CommandCategory.BUILD), STEPS)
    lifted = heard(story)
    story.expect_rows(f"Output {first.id} is one redrawn line" not in marked, marked.count(f"Output {second.id} is one redrawn line") == 1,
                      "Command make spin prints readable lines again" in lifted, detail=f"{marked}\n{lifted}")
    story.expect_text("unreadable-mark show 1", "lifted_at: ", actor=story.agent)


def test_a_person_marks_a_runs_command_from_its_card_so_its_agent_is_asked_no_reader_and_lifts_it_so_the_asks_resume(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    first = ended_after_a_while(story, moved_run(story, "make serve", CommandCategory.BUILD), STEPS)
    story.expect_text(f"process card {first.id} --json", '"markable": true', '"marked_words": ""', actor=story.user)
    story.expect_success(f"output unreadable {first.id} --environment main", actor=story.user)
    story.expect_text(f"process card {first.id} --json", '"marked_words": "make serve"', actor=story.user)
    marked = heard(story)
    quiet = ended_after_a_while(story, moved_run(story, "make serve", CommandCategory.BUILD), STEPS)
    after_mark = heard(story)
    story.expect_success(f"output readable {quiet.id} --environment main", actor=story.user)
    resumed = heard(story)
    story.expect_rows(said(UNREADABLE_DECLARED, name='make serve').is_in(marked), f"Output {quiet.id} ended" in after_mark, "No reader reads" not in after_mark,
                      said(UNREADABLE_LIFTED, name='make serve').is_in(resumed), detail=f"{marked}\n{after_mark}\n{resumed}")
    story.expect_text("unreadable-mark show 1", f"creator_id: {story.user.id}", f"lifter_id: {story.user.id}", actor=story.user)


def test_the_main_agent_hears_once_how_many_commands_agents_marked_unreadable(new_story):
    story = new_story(fixture=UserBuilder)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.advance(LONG_RUN)
    for words in ("make watch", "make serve", "npm run dev"):
        story.expect_success(f'reader unreadable "{words}" --reason "it only redraws one line"', actor=story.agent)
    for _ in range(2):
        story.advance(LONG_RUN)
        story.hook("s-1", HookSamples.session_start())
        story.run_listeners()
    lines = kept_lines(story, actor=story.user)
    story.expect_rows(lines.count("3 commands are marked unreadable by agents: review them in the viewer") == 1, detail=lines)


BINARY = "\x00\x01\x02 header\x00" * 40 + "\n"
PROMPT = "Installing the package\nProceed (y/n)? "
HOSTILE = "this output is binary\nthis output is unreadable\nno reader can read it\n" * 3


def test_empty_binary_and_waiting_outputs_mark_their_commands_after_two_runs_while_one_odd_run_and_hostile_words_mark_nothing(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    runs = {line: [] for line in ("custom-suite run", "custom-blob run", "custom-install run", "custom-odd run", "custom-words run")}
    for texts in (("", BINARY, PROMPT, BINARY, HOSTILE), ("", BINARY, PROMPT, STEPS, HOSTILE)):
        for (line, ended), text in zip(runs.items(), texts):
            category = CommandCategory.TEST_RUN if line == "custom-suite run" else CommandCategory.BUILD
            ended.append(ended_after_a_while(story, moved_run(story, line, category), text))
    lines = heard(story)
    marks = story.run("unreadable-mark list", actor=story.agent).output_text
    story.expect_rows(all(words in marks for words in ("custom-suite run", "custom-blob run", "custom-install run")), "custom-odd run" not in marks, "custom-words run" not in marks,
                      lines.count("printed nothing: its exit code is the result") == 1, lines.count("is binary: use a tool made for it") == 1,
                      lines.count("is waiting for input: stop it") == 1,
                      not any(f"No reader reads {words}" in lines for words in ("custom-suite", "custom-blob", "custom-install")),
                      "No reader reads custom-words yet" in lines, detail=f"{marks}\n{lines}")


def test_a_marked_command_is_asked_nothing_by_its_leading_words_while_another_program_is_and_its_silent_run_is_still_held(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success('reader unreadable "make watch" --reason "it only redraws one line"', actor=story.agent)
    ended_after_a_while(story, moved_run(story, "make watch --poll", CommandCategory.BUILD), STEPS)
    ended_after_a_while(story, moved_run(story, "custom-dev run", CommandCategory.BUILD), STEPS)
    told = heard(story)
    moved_run(story, "make watch --forever", CommandCategory.BUILD)
    ticks(story, 320)
    story.expect_rows("No reader reads make" not in told, "No reader reads custom-dev yet" in told, "printed nothing for 30s" not in kept_lines(story),
                      detail=f"{told}\n{kept_lines(story)}")
    story.expect_hook_refusal("s-1", HookSamples.edit("cart.py"), "printed nothing for 320s")
    story.expect_success("reader-request list", "nothing found", actor=story.agent)
