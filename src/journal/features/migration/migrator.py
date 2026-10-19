from textwrap import dedent

from journal.features.migration.bring_agents import BringAgents
from journal.features.migration.bring_checks import BringChecks
from journal.features.migration.bring_comments import BringComments
from journal.features.migration.bring_docs import BringDocs
from journal.features.migration.bring_environments import BringEnvironments
from journal.features.migration.bring_facts import BringFacts
from journal.features.migration.bring_helpers import BringHelpers
from journal.features.migration.bring_messages import BringMessages
from journal.features.migration.bring_plans import BringPlans
from journal.features.migration.bring_questions import BringQuestions
from journal.features.migration.bring_reactions import BringReactions
from journal.features.migration.bring_reminders import BringReminders
from journal.features.migration.bring_reports import BringReports
from journal.features.migration.bring_rules import BringRules
from journal.features.migration.bring_secrets import BringSecrets
from journal.features.migration.bring_sequences import BringSequences
from journal.features.migration.bring_settings import BringSettings
from journal.features.migration.bring_templates import BringTemplates
from journal.features.migration.bring_triggers import BringTriggers
from journal.features.migration.bring_waits import BringWaits
from journal.features.migration.bring_todos import BringTodos
from journal.features.migration.bring_work import BringWork
from journal.features.migration.brought import Brought
from journal.features.migration.version_3_backup import Version3Backup
from journal.support.actor import Actor
from journal.models.version3_migration import Version3Migration
from journal.models.report import Report
from journal.repositories.version3_migrations import Version3Migrations
from journal.repositories.reports import Reports
from journal.support.scope import Scope


class Migrator:
    """Brings the kept version 3 journal across, kind by kind, and says what came in a report; nothing that fails stops it: a row or a kind that cannot come across is named in the report with its error, and the run goes on."""

    def __init__(self, backup: Version3Backup, migrations: Version3Migrations, reports: Reports, scope: Scope, environments: BringEnvironments, messages: BringMessages, todos: BringTodos, waits: BringWaits, work: BringWork, plans: BringPlans, questions: BringQuestions, facts: BringFacts, rules: BringRules, reminders: BringReminders, docs: BringDocs, old_reports: BringReports, checks: BringChecks, triggers: BringTriggers, sequences: BringSequences, templates: BringTemplates, settings: BringSettings, agents: BringAgents, helpers: BringHelpers, secrets: BringSecrets, comments: BringComments, reactions: BringReactions) -> None:
        self.backup, self.migrations, self.reports, self.scope = backup, migrations, reports, scope
        self.kinds = (environments, messages, todos, waits, work, plans, questions, facts, rules, reminders, docs, old_reports, checks, triggers, sequences, templates, settings, agents, helpers, secrets, comments, reactions)

    def begin(self, by: Actor) -> Version3Migration:
        return self.migrations.save(self.migrations.current().begun(), by)

    def run(self, migration: Version3Migration, by: Actor) -> Version3Migration:
        brought = [self.brought(kind, by) for kind in self.kinds]
        self.reports.save(self.report(brought), by)
        return self.migrations.save(migration.done(), by)

    def brought(self, kind, by: Actor) -> Brought:
        """One kind brought across; a kind that cannot be read at all is named in the report, and the run goes on with the next."""
        try:
            return kind.bring(self.backup.folder, by)
        except Exception as fault:
            return Brought(kind.title, 0, (f"the whole kind could not be read: {fault}",))

    def report(self, brought: list[Brought]) -> Report:
        rows = "\n".join(one.line() for one in brought)
        skipped = "\n".join(f"- {one.kind}: {why}" for one in brought for why in one.skipped) or "Nothing."
        body = dedent("""\
            ## Brought across

            | Kind | Rows | Left behind |
            |---|---|---|
            {rows}

            ## Left behind

            {skipped}""").format(rows=rows, skipped=skipped)
        return Report(environment_id=self.scope.id, title="The version 3 journal brought across", abstract="What came across from .journal/version-3, kind by kind, and what was left behind and why", body=body)
