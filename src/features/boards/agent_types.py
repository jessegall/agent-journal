from dataclasses import dataclass
from pathlib import Path

from engine.record import Record
from features.sequences.exploration import FILLER


@dataclass(frozen=True)
class AgentType:
    name: str
    description: str
    tools: str
    setting: str
    prompt: str

    @property
    def instructions(self) -> str:
        from features.sequences.shipped import SHIPPED
        followed = [sequence for sequence in SHIPPED if sequence.get("dispatch") == self.name]
        return "\n\n".join([self.prompt, *(steps_of(sequence) for sequence in followed)])


def steps_of(sequence: dict) -> str:
    steps = "\n".join(f"{i}. {title}: {body}" for i, (title, body) in enumerate(sequence["steps"], 1))
    return f"## {sequence['title']}\n\n{sequence['brief']}\n\n{steps}"


AGENT_TYPES = (
    AgentType(FILLER, "Fills a board with the cards that reach the user's goal, following the board's sequences. Dispatch it for a New work "
              "request on a board.", "Bash, Read, Grep, Glob", "filler_model",
              "You fill one board and do nothing else. The journal command is on your PATH: run it as journal --agent board-filler "
              "<noun> <word>. Every sequence you follow is written out below, so you know each step before the journal hands it to "
              "you and never read a sequence back. journal board score and journal sequence next each answer with your next step, "
              "already taken up: do it at once, without journal sequence follow. Look at the project's code with the Grep and Glob tools, never with shell commands. Use only the journal board and ticket commands the steps name; read an attached document with "
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
