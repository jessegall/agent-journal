import sqlite3
from argparse import ArgumentParser

from engine.actor.actor import Actor
from engine.database.database import Database
from engine.database.statement import Statement
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from engine.enums.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.agent_labels import agent_number

ROWS_WANTED = 130
COPY_ROUNDS = 8
COMMAND_ROWS = 60
UNCOPIED_TABLE = "sqlite_sequence"
EDIT = HookSamples.edit("src/cart.py")


class LargeJournal(StoryFixture):
    """A journal with a main agent, a person, a helper and a worker, a few rows of many types made by
    commands and hooks, and then every table copied onto itself until it has more rows than any read may
    load at once. The rows are made up here; none comes from a real journal."""

    parent = UserBuilder

    def steps(self, story):
        story.helper = Actor(story.new_row_id(f"agent start s-helper claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
        story.run(f"agent start s-worker claude worker --parent {story.agent.id} --environment main", actor=story.user)
        for line in SEED_LINES:
            story.expect_success(f"{line} --environment main", actor=story.agent)
        for line in PERSON_SEED_LINES:
            story.expect_success(f"{line.format(agent=story.agent.id)} --environment main", actor=story.user)
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        for profile in HELPER_PROFILES:
            story.expect_success(f'helper start {profile} --brief "Read the cart code" --environment main', actor=story.agent)
        launcher.drain_requests()
        launcher.server.close()
        for number in range(COMMAND_ROWS):
            story.expect_success(f'task make "Cart part {number}" --brief "Part {number} of the cart; done when it counts" --environment main', actor=story.agent)
            story.expect_success(f"task block {number + 3} --on task:1 --environment main", actor=story.agent)
            story.expect_success(f'message send "Cart note {number}" --to agent:{agent_number(story, story.agent.id)} --environment main', actor=story.user)
            story.expect_success(f"agent start s-helper-{number} claude helper --parent {story.agent.id} --environment main")
        for session in ("s-1", "s-helper", "s-worker"):
            for sample in (HookSamples.session_start(), HookSamples.prompt("go on"), EDIT, HookSamples.stop()):
                story.hook(session, sample)
        story.run_listeners()
        TableCopies(story.container.get(Database)).grow()


HELPER_PROFILES = ("journal-researcher", "journal-planner", "journal-plan-reviewer", "journal-debugger", "journal-code-reviewer")

SEED_LINES = (
    'task make "Fix the cart total" --brief "The total is wrong; done when it is right"',
    'task make "Write the cart tests" --brief "Cover the cart; done when they pass"',
    "task block 2 --on task:1",
    'task log 1 "Read the cart code"',
    'memory make "The cart total is counted in cents" --weight 5',
    'doc make "Cart design" --abstract "How the cart counts" --body "The cart counts in cents."',
    'report make "Cart check" --abstract "What was checked" --body "The total was checked."',
    'plan make "Cart plan" --brief "A right cart total"',
    'check make "Cart check" --command "true" --every 10 --brief "Passes when the cart is right"',
    'reminder make "Look at the cart" --every-minutes 10',
    'question ask "Which cart?" --context "Two carts exist. One must be chosen." --options "a" "b" --recommend "a"',
)

PERSON_SEED_LINES = (
    'message send "Please fix the cart" --to agent:{agent_number(story, agent)}',
    'rule make "Count in cents"',
)


class TableCopies:
    """Copies the rows of every table onto the table itself, with a suffix on the text columns of its unique
    indexes, until each has the wanted number of rows or cannot grow."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def grow(self) -> None:
        for table in self.tables():
            self.grow_table(table)

    def small_tables(self) -> dict[str, str]:
        counts = {table: self.count(table) for table in self.tables()}
        return {table: f"{count} rows: {self.copy_error(table)}" for table, count in counts.items() if 0 < count < ROWS_WANTED}

    def tables(self) -> list[str]:
        return [row[0] for row in self.database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'table'")) if row[0] != UNCOPIED_TABLE]

    def grow_table(self, table: str) -> None:
        for _ in range(COPY_ROUNDS):
            count = self.count(table)
            if count == 0 or count >= ROWS_WANTED or not self.is_copied(table):
                return

    def count(self, table: str) -> int:
        return self.database.rows(Statement(f"SELECT count(*) FROM {table}"))[0][0]

    def is_copied(self, table: str) -> bool:
        return self.copy_error(table) == ""

    def copy_error(self, table: str) -> str:
        columns = [(row[1], row[2].upper()) for row in self.database.rows(Statement(f"PRAGMA table_info({table})")) if not row[5]]
        unique = self.unique_columns(table)
        values = ", ".join(f"{name} || '-' || abs(random())" if name in unique and "TEXT" in column_type else name for name, column_type in columns)
        names = ", ".join(name for name, _ in columns)
        try:
            self.database.update(Statement(f"INSERT INTO {table} ({names}) SELECT {values} FROM {table}"))
        except sqlite3.DatabaseError as error:
            return str(error)
        return ""

    def unique_columns(self, table: str) -> set[str]:
        indexes = [row[1] for row in self.database.rows(Statement(f"PRAGMA index_list({table})")) if row[2]]
        return {row[2] for index in indexes for row in self.database.rows(Statement(f"PRAGMA index_info({index})"))}


def required_arguments(parser: ArgumentParser) -> list[str]:
    arguments: list[str] = []
    for action in parser._actions:
        value = str(action.choices[0]) if action.choices else "1"
        if not action.option_strings and action.nargs not in ("?", "*") and action.dest != "help":
            arguments.append(value)
        elif action.option_strings and action.required:
            arguments.extend([action.option_strings[0], value])
    return arguments
