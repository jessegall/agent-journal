from engine.agent_machine.contracts.printer import Printer
from engine.agent_machine.decision_record import DecisionRecord
from engine.driver.hook_reply import HookReply
from engine.enums.decision_class import DecisionClass

LINE_LABEL = "journal: "


class ReplyPrinter(Printer):
    """Prints a decision record as the program-neutral reply the Go hook encodes for each program (its answer.go reads
    the provider's table): a halt, a refusal with its reason, or an allowance with its lines and the rewrite the step
    kept. It encodes and never changes the decision."""

    def encoded(self, record: DecisionRecord) -> HookReply:
        lines = [line.text for line in record.lines]
        labelled = [f"{LINE_LABEL}{text}" for text in lines]
        if record.decision.decision_class is DecisionClass.HALT:
            return HookReply(halt=record.shown_reason.text, terminal=record.terminal)
        if not record.decision.admits():
            return HookReply(refusal=record.shown_reason.text, lines=lines, terminal=record.terminal, labelled_lines=labelled)
        tool_input = record.rewrite.tool_input if record.rewrite.tool_input is not None else {}
        return HookReply(lines=lines, updated_input=tool_input, terminal=record.terminal, labelled_lines=labelled)
