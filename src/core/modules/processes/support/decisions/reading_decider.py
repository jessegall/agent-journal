from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.models.enums.reader_action import ReaderAction
from core.modules.processes.models.enums.reader_state import ReaderState
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.enums.reason_code import ReasonCode
from core.modules.processes.support.decisions.reading_case import ReadingCase
from core.modules.processes.support.decisions.reading_decision import ReadingDecision

PREVENT_AFTER_RUNS = 2
REQUIRING_LEVELS = (PressureLevel.PREVENT, PressureLevel.BLOCK)


class ReadingDecider:
    """The one place that decides, from the facts of a part of a run, whether it has a good reader and what the
    agent must do; it reads nothing and keeps nothing."""

    def decide(self, case: ReadingCase) -> ReadingDecision:
        if case.is_not_needed:
            return ReadingDecision.nothing(ReaderState.NOT_NEEDED)
        if case.unreadable_reason is not None:
            return self.unreadable(case)
        if case.reader_is_suitable and not case.reader_failed and not case.count_missing:
            return ReadingDecision.nothing(ReaderState.SUITABLE)
        state = self.state_without_suitable_reader(case)
        level = self.level(case)
        return ReadingDecision.pressing(state, self.action(case, level), level, self.reason(case, state), case.exits_for(level))

    @staticmethod
    def unreadable(case: ReadingCase) -> ReadingDecision:
        action = ReaderAction.NOTHING if case.has_unreadable_mark else ReaderAction.DECLARE_UNREADABLE
        return ReadingDecision.pressing(ReaderState.UNREADABLE, action, PressureLevel.SUGGEST, ReasonCode.UNREADABLE, case.exits_for(PressureLevel.SUGGEST))

    @staticmethod
    def state_without_suitable_reader(case: ReadingCase) -> ReaderState:
        if case.count_missing:
            return ReaderState.MISSING
        if case.reader_judgement is not None:
            return ReaderState.POOR
        return ReaderState.DRAFTABLE if case.draft_fits else ReaderState.MISSING

    @staticmethod
    def level(case: ReadingCase) -> PressureLevel:
        if case.is_request_waiting_for_reader:
            return PressureLevel.BLOCK
        if case.output_hidden:
            return PressureLevel.PREVENT
        if case.was_skipped:
            return PressureLevel.SUGGEST
        return PressureLevel.PREVENT if case.runs_without_change >= PREVENT_AFTER_RUNS else PressureLevel.SUGGEST

    @staticmethod
    def action(case: ReadingCase, level: PressureLevel) -> ReaderAction:
        if case.role_must_have_reader and level in REQUIRING_LEVELS:
            return ReaderAction.REQUIRE
        if case.moment is not ReadingMoment.END:
            return ReaderAction.NOTHING
        return ReaderAction.DRAFT_READY if case.draft_fits else ReaderAction.SUGGEST

    @staticmethod
    def reason(case: ReadingCase, state: ReaderState) -> ReasonCode:
        if case.output_hidden:
            return ReasonCode.REDIRECTED
        if case.is_request_waiting_for_reader:
            return ReasonCode.REQUEST_WAITING
        if case.count_missing:
            return ReasonCode.COUNT_MISSING
        if case.reader_failed:
            return ReasonCode.READER_FAILED
        if state is ReaderState.POOR and case.reader_judgement is not None:
            return case.reader_judgement.reason_code
        return state.reason_code
