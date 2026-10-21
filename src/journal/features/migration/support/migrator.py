from textwrap import dedent

from journal.features.migration.support.brings.agent_import import AgentImport
from journal.features.migration.support.brings.check_import import CheckImport
from journal.features.migration.support.brings.comment_import import CommentImport
from journal.features.migration.support.brings.doc_import import DocImport
from journal.features.migration.support.brings.environment_import import EnvironmentImport
from journal.features.migration.support.brings.fact_import import FactImport
from journal.features.migration.support.brings.helper_import import HelperImport
from journal.features.migration.support.brings.message_import import MessageImport
from journal.features.migration.support.brings.plan_import import PlanImport
from journal.features.migration.support.brings.question_import import QuestionImport
from journal.features.migration.support.brings.reaction_import import ReactionImport
from journal.features.migration.support.brings.reminder_import import ReminderImport
from journal.features.migration.support.brings.report_import import ReportImport
from journal.features.migration.support.brings.rule_import import RuleImport
from journal.features.migration.support.brings.secret_import import SecretImport
from journal.features.migration.support.brings.sequence_import import SequenceImport
from journal.features.migration.support.brings.setting_import import SettingImport
from journal.features.migration.support.brings.template_import import TemplateImport
from journal.features.migration.support.brings.trigger_import import TriggerImport
from journal.features.migration.support.brings.wait_import import WaitImport
from journal.features.migration.support.brings.todo_import import TodoImport
from journal.features.migration.support.brings.work_import import WorkImport
from journal.features.migration.support.import_tally import ImportTally
from journal.support.version_3_backup import Version3Backup
from journal.support.actor import Actor
from journal.models.version3_migration import Version3Migration
from journal.models.report import Report
from journal.repositories.version3_migrations import Version3Migrations
from journal.repositories.reports import Reports
from journal.support.scope import Scope


class Migrator:
    """Brings the kept version 3 journal across, kind by kind, and says what came in a report; nothing that fails stops it: a row or a kind that cannot come across is named in the report with its error, and the run goes on."""

    def __init__(self, backup: Version3Backup, migrations: Version3Migrations, reports: Reports, scope: Scope, environments: EnvironmentImport, messages: MessageImport, todos: TodoImport, waits: WaitImport, work: WorkImport, plans: PlanImport, questions: QuestionImport, facts: FactImport, rules: RuleImport, reminders: ReminderImport, docs: DocImport, old_reports: ReportImport, checks: CheckImport, triggers: TriggerImport, sequences: SequenceImport, templates: TemplateImport, settings: SettingImport, agents: AgentImport, helpers: HelperImport, secrets: SecretImport, comments: CommentImport, reactions: ReactionImport) -> None:
        self.backup, self.migrations, self.reports, self.scope = backup, migrations, reports, scope
        self.kinds = (environments, messages, todos, waits, work, plans, questions, facts, rules, reminders, docs, old_reports, checks, triggers, sequences, templates, settings, agents, helpers, secrets, comments, reactions)

    def begin(self, actor: Actor) -> Version3Migration:
        return self.migrations.save(self.migrations.current().is_started(), actor)

    def run(self, migration: Version3Migration, actor: Actor) -> Version3Migration:
        ported = [self.imported(kind, actor) for kind in self.kinds]
        self.reports.save(self.report(ported), actor)
        return self.migrations.save(migration.is_finished(), actor)

    def imported(self, kind, actor: Actor) -> ImportTally:
        try:
            return kind.import_rows(self.backup.folder, actor)
        except Exception as fault:
            return ImportTally(kind.title, 0, (f"the whole kind could not be read: {fault}",))

    def report(self, imported: list[ImportTally]) -> Report:
        rows = "\n".join(single.line() for single in imported)
        skipped = "\n".join(f"- {single.kind}: {reason}" for single in imported for reason in single.skipped) or "Nothing."
        body = dedent("""\
            ## Brought across

            | Kind | Rows | Left behind |
            |---|---|---|
            {rows}

            ## Left behind

            {skipped}""").format(rows=rows, skipped=skipped)
        return Report(environment_id=self.scope.id, title="The version 3 journal brought across", abstract="What came across from .journal/version-3, kind by kind, and what was left behind and why", body=body)
