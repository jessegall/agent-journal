from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from suites.coding.modules.workers.support.behind_facts import BehindFacts
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.behind_facts_reader import BehindFactsReader


class ReadBehindFactsSubcommand(ReadSubcommand[BehindFacts | Refusal]):
    """`journal merger behind <worker>`: how far the worker's worktree is behind its base branch, and the facts
    an update would touch."""

    cli_name = "merger"
    name = "behind"

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, reader: BehindFactsReader, numbers: RowNumbers) -> None:
        self.queries, self.worktrees, self.reader, self.numbers = queries, worktrees, reader, numbers

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=AgentNumber)

    def read(self, arguments: Namespace, caller: Caller) -> BehindFacts | Refusal:
        worktree = self.worktrees.worker_worktree(arguments.worker_id)
        if worktree is None:
            return Refusal(f"no {AgentLabel.labelled_row(arguments.worker_id, self.numbers, 'worker').text} with a worktree in this environment")
        return self.reader.read(worktree, self.queries.query(Agent).find(arguments.worker_id))

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, BehindFacts):
            super().write_output(value, output)
            return
        output.write("\n".join(value.lines()), {"base_branch": value.base_branch, "behind": value.commits_lagging, "worker_files": list(value.worker_files), "overlap": list(value.overlap),
                                                "same_folder": list(value.shared_folder), "overlap_lines": value.overlap_lines, "has_uncommitted": value.has_uncommitted,
                                                "program": value.program, "model": value.model,
                                                "commits": [{"short_id": commit.short_id, "subject": commit.subject, "files": list(commit.files)} for commit in value.commits]})
