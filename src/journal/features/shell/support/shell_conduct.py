from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_files import OutputFiles
from journal.support.chain import Chain

SILENCE_SECONDS = 5.0
BACKGROUND_CHECK_DELAY_SECONDS = 300.0


class ShellConduct(Conduct):
    """The shell feature's conduct in every state: a file longer than the runner shows is read in parts, a journal command runs alone, a read of an output by hand is pointed at a reader or asked to become one, the commands that ended in the background are named once the agent is quiet, one the agent waits on left to the wait, and one running five minutes is looked at."""

    def on_tool_starting_shell_read_in_parts(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        cap = int(settings.value(Shell.SHOWN))
        return self.refuse(Shell.PARTIAL_FILE_READ.create(lines=event.call.file_lines, cap=cap)) if event.call.file_lines > 2 * cap else self.none()

    def on_tool_starting_shell_journal_alone(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        journal, parts = event.call.journal_parts()
        return self.refuse(Shell.JOURNAL_COMMAND_ISOLATION.create()) if 0 < journal < parts else self.none()

    def on_tool_starting_shell_readers(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        reads = [part for part in event.call.parts if part.reads_output]
        if not reads:
            return self.none()
        shell = event.data.part(Shell)
        tips = [Shell.READER_HINT.create(reader=r.name, about=r.about) for r in shell.readers if r.matches(reads[0].text)]
        if shell.output_reads.count(reads[0].read_shape) >= 2:
            tips.append(Shell.READER_SUGGESTION.create(command=reads[0].read_shape))
        new_tips = [tip for tip in tips if tip.rendered() not in shell.tipped]
        return self.none(new_tips[0]) if new_tips else self.none()

    def on_ticked_shell_ended(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        ended = event.data.part(Shell).ended_untold
        if event.quiet_for < SILENCE_SECONDS or not ended:
            return self.none()
        return self.none(Shell.OUTPUTS_ENDED.create(outputs=named(ended), n=ended[0].id))

    def on_ticked_shell_background(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        shell = event.data.part(Shell)
        if not shell.background or event.time - shell.background_since < BACKGROUND_CHECK_DELAY_SECONDS:
            return self.none()
        return self.none(Shell.BACKGROUND_CHECK.create(background_outputs=", ".join(str(n) for n in shell.background)))


def named(ended: tuple[EndedOutput, ...]) -> str:
    outcomes: dict[str, list[int]] = {}
    for output in ended:
        outcomes.setdefault(OutputFiles.ended(output.status), []).append(output.id)
    return "; ".join(f"output{'s' if len(ids) > 1 else ''} {', '.join(map(str, ids))} {outcome}" for outcome, ids in outcomes.items())
