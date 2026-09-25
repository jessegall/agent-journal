import re
from dataclasses import dataclass
from pathlib import Path

from engine.record import Record
from features.sequences.exploration import FILLER
from features.parts import AgentContext, ToolInterceptor
from providers.payload import WriteCall

FILLER_ALLOWED = re.compile(r"^journal\s+(?:--\S+\s+)*(?:board\s+(?:show|paths|score|ask|expect|say|log|group|outline|progress|stall)"
                            r"|ticket\s+(?:board|show|create|update|delete|depend)|message\s+show|sequence\s+(?:follow|next|show))\b")
JOURNAL_CALLS = re.compile(r"(?:^|[;&|(\n])\s*(\S+)")


@dataclass(frozen=True)
class AgentType:
    name: str
    description: str
    tools: str
    setting: str
    prompt: str


AGENT_TYPES = (
    AgentType(FILLER, "Fills a board with the cards that reach the user's goal, following the board's sequences. Dispatch it for a New work "
              "request on a board.", "Bash, Read", "filler_model",
              "You fill one board and do nothing else. Follow the sequence steps the journal hands you, one at a time, with journal "
              "sequence follow and next. Use only the journal board and ticket commands the steps name; read an attached document with "
              "Read. Never load skills, write in the chat, start the board, move tickets, edit files or run git. When the last step is "
              "done, answer with one line: drafted <count> cards on board <n>."),
    AgentType("ticket-reviewer", "Reviews a finished ticket before it is merged: runs its tests and checks its diff against each done-when "
              "clause of its card. Read-only.", "Read, Grep, Glob, Bash", "reviewer_model",
              "You review one ticket's finished work. Read the ticket (journal ticket show <n>), its diff against the board's branch and "
              "its tests' output. For every done-when clause of the card, answer pass or fail with the file and line that show it. "
              "Change nothing and write nothing to the journal."),
    AgentType("plan-reviewer", "Reviews a ticket's plan against its card before it is approved. Read-only.", "Read, Grep, Glob, Bash",
              "reviewer_model",
              "You review one ticket's plan. Read the ticket's card and the plan it names. Say whether the plan does the ticket and "
              "nothing more, and list what must change if not. Change nothing and write nothing to the journal."),
    AgentType("goal-verifier", "Checks a finished board's goal clause by clause on the board's branch. Read-only.", "Read, Grep, Glob, Bash",
              "reviewer_model",
              "You check whether a board reached its goal. Read the board (journal board show <n>): its goal and numbered done-when "
              "clauses. Run the full tests on the board's branch, then check each clause for real: run it, open it, read it. Answer met "
              "or not met per clause, with evidence. Change nothing and write nothing to the journal."),
)


def written(project: Path, record: Record) -> list[Path]:
    from features.boards.details import BoardsDetails
    from providers import PROVIDERS
    values = BoardsDetails.values(record)
    chosen = [(kind, str(getattr(values, kind.setting))) for kind in AGENT_TYPES]
    return [path for cls in PROVIDERS.values() if cls().present(project) for path in cls().agent_types(project, chosen)]


class KeepTheFillerToItsTask(ToolInterceptor):
    for_subagents = True

    def intercept(self, context: AgentContext, call) -> str:
        if not context.hook or context.hook.agent_type != FILLER:
            return ""
        if isinstance(call, WriteCall):
            return "the board-filler never edits files; fill the board with journal board and ticket commands"
        outside = [command.strip() for command in call.commands if command.strip() and not FILLER_ALLOWED.match(command.strip())]
        return (f"the board-filler may only run the board-filling journal commands; not: {outside[0][:120]}") if outside else ""
