from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_files import OutputFiles
from journal.support.chain import Chain

QUIET_FOR = 5.0
LOOK_AFTER = 300.0


class ShellConduct(Conduct):
    """The shell feature's conduct in every state: a file longer than the runner shows is read in parts, a journal command runs alone, a read of an output by hand is pointed at a reader or asked to become one, the commands that ended in the background are named once the agent is quiet, one the agent waits on left to the wait, and one running five minutes is looked at."""

    def on_tool_starting_shell_read_in_parts(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        cap = int(settings.of(Shell.SHOWN))
        return self.hold(Shell.READ_THE_FILE_IN_PARTS.create(lines=event.call.file_lines, cap=cap)) if event.call.file_lines > 2 * cap else self.unchanged()

    def on_tool_starting_shell_journal_alone(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        journal, parts = event.call.journal_parts()
        return self.hold(Shell.JOURNAL_COMMAND_RUNS_ALONE.create()) if 0 < journal < parts else self.unchanged()

    def on_tool_starting_shell_readers(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        reads = [part for part in event.call.parts if part.reads_output]
        if not reads:
            return self.unchanged()
        shell = event.readings.of(Shell)
        tips = [Shell.USE_THE_READER.create(reader=r.name, about=r.about) for r in shell.readers if r.matches(reads[0].text)]
        if shell.output_reads.count(reads[0].read_shape) >= 2:
            tips.append(Shell.ADD_A_READER.create(command=reads[0].read_shape))
        new_tips = [tip for tip in tips if tip.rendered() not in shell.tipped]
        return self.unchanged(new_tips[0]) if new_tips else self.unchanged()

    def on_ticked_shell_ended(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        ended = event.readings.of(Shell).ended_untold
        if event.quiet_for < QUIET_FOR or not ended:
            return self.unchanged()
        return self.unchanged(Shell.OUTPUTS_ENDED.create(outputs=named(ended), n=ended[0].id))

    def on_ticked_shell_background(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        shell = event.readings.of(Shell)
        if not shell.background or event.time - shell.background_since < LOOK_AFTER:
            return self.unchanged()
        return self.unchanged(Shell.CHECK_THE_BACKGROUND.create(background_outputs=", ".join(str(n) for n in shell.background)))


def named(ended: tuple[EndedOutput, ...]) -> str:
    outcomes: dict[str, list[int]] = {}
    for output in ended:
        outcomes.setdefault(OutputFiles.ended(output.status), []).append(output.id)
    return "; ".join(f"output{'s' if len(ids) > 1 else ''} {', '.join(map(str, ids))} {outcome}" for outcome, ids in outcomes.items())
