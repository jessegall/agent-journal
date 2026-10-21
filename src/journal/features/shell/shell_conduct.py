from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.features.shell.support.ended_output import EndedOutput
from journal.support.chain import Chain

SILENCE_SECONDS = 5.0
BACKGROUND_CHECK_DELAY_SECONDS = 300.0


class ShellConduct(Conduct):
    """The shell feature's conduct in every state: a file longer than the runner shows is read in parts, a journal command runs alone, a read of an output by hand is pointed at a reader or asked to become one, the commands that ended in the background are named once the agent is quiet, one the agent waits on left to the wait, one running five minutes is looked at, and a watched output's view is said after every tool use until its command ends."""

    def partial_read_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        cap = int(settings.value(Shell.SHOWN))
        return self.refuse(Shell.PARTIAL_FILE_READ.create(lines=event.call.file_lines, cap=cap)) if event.call.file_lines > 2 * cap else self.none()

    def journal_alone_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        journal, parts = event.call.journal_parts()
        return self.refuse(Shell.JOURNAL_COMMAND_ISOLATION.create()) if 0 < journal < parts else self.none()

    def readers_check(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        reads = [part for part in event.call.parts if part.reads_output]
        if not reads:
            return self.none()
        shell = event.data.part(Shell)
        tips = [Shell.READER_HINT.create(reader=r.name, about=r.subject) for r in shell.readers if r.matches(reads[0].text)]
        if shell.output_reads.count(reads[0].read_shape) >= 2:
            tips.append(Shell.READER_SUGGESTION.create(command=reads[0].read_shape))
        new_tips = [tip for tip in tips if tip.rendered() not in shell.tipped]
        return self.none(new_tips[0]) if new_tips else self.none()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return Transition.merged(self, [ShellConduct.journal_alone_check(self, event, settings), ShellConduct.partial_read_check(self, event, settings), ShellConduct.readers_check(self, event, settings)])

    def on_tool_finished(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        watch = event.data.part(Shell).watch
        if not watch.is_watching():
            return self.none()
        if watch.ending:
            return self.none(Shell.WATCH_ENDED.create(n=watch.output, ending=watch.ending, lines=watch.text()))
        return self.none(Shell.WATCH_VIEW.create(n=watch.output, lines=watch.text()))

    def ended_check(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        ended = event.data.part(Shell).unannounced
        if event.silence_seconds < SILENCE_SECONDS or not ended:
            return self.none()
        return self.none(Shell.OUTPUTS_ENDED.create(outputs=outcome_text(ended), n=ended[0].id))

    def background_check(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        shell = event.data.part(Shell)
        if not shell.background or event.time - shell.backgrounded_at < BACKGROUND_CHECK_DELAY_SECONDS:
            return self.none()
        return self.none(Shell.BACKGROUND_CHECK.create(background_outputs=", ".join(str(n) for n in shell.background)))

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return Transition.merged(self, [ShellConduct.background_check(self, event, settings), ShellConduct.ended_check(self, event, settings)])


def outcome_text(ended: tuple[EndedOutput, ...]) -> str:
    outcomes: dict[str, list[int]] = {}
    for output in ended:
        outcomes.setdefault(output.ending, []).append(output.id)
    return "; ".join(f"output{'s' if len(ids) > 1 else ''} {', '.join(map(str, ids))} {outcome}" for outcome, ids in outcomes.items())
