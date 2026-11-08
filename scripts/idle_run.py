from pathlib import Path

root = Path(__file__).resolve().parents[1]
stories = root / "tests" / "stories" / "core" / "modules" / "waits" / "idle_wakes.py"
text = stories.read_text()
text = text.replace("from tests.stories.core.modules.processes.support.process_samples import start_process\n", "from tests.stories.core.modules.processes.support.process_samples import end_run, moved_run, start_process\n", 1)
text += '''

def test_an_agent_stopped_while_a_run_it_moved_to_the_background_ends_is_woken_whether_it_failed_or_passed(new_story):
    for exit_code in (0, 2):
        story = new_story(fixture=BuilderStarted)
        entered = kept_typing(story)
        process = moved_run(story, "make build")
        story.hook("s-1", HookSamples.stop().with_fields(accepts_lines=False))
        story.advance(timedelta(seconds=IDLE_SECONDS))
        story.expect_rows(entered == [])
        end_run(story, process, "built\\n", exit_code)
        story.run_listeners()
        story.expect_rows(entered == [(story.agent.id, f"[journal] output {process.id} ended")], detail=f"exit {exit_code}: {entered}")
'''
stories.write_text(text)

nudges = root / "src" / "core" / "modules" / "processes" / "support" / "process_nudges.py"
nudge_text = nudges.read_text()
old = "OUTPUT_ENDED = NudgeDeclaration(\"processes.output_ended\", NudgeType.STEERING, 'output {output} ended')"
assert old in nudge_text
nudges.write_text(nudge_text.replace(old, "OUTPUT_ENDED = NudgeDeclaration(\"processes.output_ended\", NudgeType.STEERING, 'output {output} ended', wakes_agent=True)", 1))
print("done", flush=True)
