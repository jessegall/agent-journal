<?php

declare(strict_types=1);

namespace App\Processes\Providers;

use App\Links\Support\LinkTypeRegistry;
use App\Processes\Admission\LineAdmission;
use App\Processes\Classification\TreeClassifier;
use App\Processes\Console\CommandTypeApproveCommand;
use App\Processes\Console\CommandTypeImportCommand;
use App\Processes\Console\CommandTypeListCommand;
use App\Processes\Console\CommandTypeProposeCommand;
use App\Processes\Console\CommandTypeRejectCommand;
use App\Processes\Console\CommandTypeRestoreCommand;
use App\Processes\Console\CommandTypeRetireCommand;
use App\Processes\Console\CommandTypeReviseCommand;
use App\Processes\Console\CommandTypeShowCommand;
use App\Processes\Console\CommandTypeWithdrawCommand;
use App\Processes\Console\ExplainCommandTypeCommand;
use App\Processes\Console\OutputReadCommand;
use App\Processes\Console\ProcessCleanCommand;
use App\Processes\Console\ProcessExportCommand;
use App\Processes\Console\ProcessReconcileCommand;
use App\Processes\Console\ProcessRestoreCheckCommand;
use App\Processes\Console\ProcessShowCommand;
use App\Processes\Console\ReaderProposeCommand;
use App\Processes\Console\ReaderProveCommand;
use App\Processes\Console\ReaderSampleApproveCommand;
use App\Processes\Console\ReaderSampleRunCommand;
use App\Processes\Console\RunProcessCommand;
use App\Processes\Contracts\AliasReader;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\CommandRuleReader;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Contracts\ResultPublisher;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Contracts\VerificationTiming;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\CommandAlias;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\OutputChunk;
use App\Processes\Models\PartRun;
use App\Processes\Models\PermissionRevocation;
use App\Processes\Models\ProcessEvent;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\ReaderPosition;
use App\Processes\Models\ReaderProof;
use App\Processes\Models\ReaderRevision;
use App\Processes\Models\ResultReceipt;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleRevision;
use App\Processes\Rules\JournalClassifier;
use App\Processes\Support\ActiveRules;
use App\Processes\Support\CommandAliases;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Support\JournalRoutes;
use App\Processes\Support\OpenTiming;
use App\Processes\Support\ProgramClassifiers;
use App\Processes\Support\ProjectReceipts;
use App\Processes\Support\ProjectRules;
use App\Processes\Support\RequiredServices;
use App\Processes\Support\ReceiptPublisher;
use App\Processes\Support\ShellParser;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Syntax\TreeParser;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * Supplies the shell command parser the Hooks domain reads every shell command with, and registers the stable link
 * name of Processes' own model.
 */
final class ProcessesServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ShellCommandParser::class, ShellParser::class);
        $this->app->singleton(ShellSyntax::class, TreeParser::class);
        $this->app->scoped(CommandClassifier::class, TreeClassifier::class);
        $this->app->scoped(CommandRuleReader::class, ProjectRules::class);
        $this->app->scoped(ActiveRules::class);
        $this->app->scoped(ShellAdmission::class, LineAdmission::class);
        $this->app->scoped(VerificationTiming::class, OpenTiming::class);
        $this->app->scoped(ResultPublisher::class, ReceiptPublisher::class);
        $this->app->scoped(ResultReceipts::class, ProjectReceipts::class);
        $this->app->when(TreeClassifier::class)
            ->needs(CommandRuleRegistry::class)
            ->give(fn (Application $app): CommandRuleRegistry => $app->make(ActiveRules::class)->registry());
        $this->app->scoped(AliasReader::class, CommandAliases::class);
        $this->app->scoped(OutputRecorder::class, SpoolRecorder::class);
        $this->app->singleton(
            JournalRoutes::class,
            fn (Application $app) => JournalRoutes::fromCommands($app->make(ConsoleKernel::class)->all()),
        );
        $this->app->scoped(ProgramClassifiers::class, fn (Application $app) => new ProgramClassifiers([
            new JournalClassifier($app->make(JournalRoutes::class), $app->basePath('bin/journal')),
        ]));
    }

    public function boot(LinkTypeRegistry $links): void
    {
        RequiredServices::check($this->app);
        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('process:reconcile')->everyMinute(),
        );
        $links->register([
            'processes.command-alias' => CommandAlias::class,
            'processes.process-run' => ProcessRun::class,
            'processes.part-run' => PartRun::class,
            'processes.process-event' => ProcessEvent::class,
            'processes.output-chunk' => OutputChunk::class,
            'processes.permission-revocation' => PermissionRevocation::class,
            'processes.evidence-permit' => EvidencePermit::class,
            'processes.command-request' => CommandRequest::class,
            'processes.reader-revision' => ReaderRevision::class,
            'processes.reader-position' => ReaderPosition::class,
            'processes.rule-proposal' => RuleProposal::class,
            'processes.rule-revision' => RuleRevision::class,
            'processes.classification-rule' => ClassificationRule::class,
            'processes.reader-proof' => ReaderProof::class,
            'processes.output-assessment' => OutputAssessment::class,
            'processes.result-receipt' => ResultReceipt::class,
        ]);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/processes.php');
        $this->commands([
            ExplainCommandTypeCommand::class,
            CommandTypeApproveCommand::class,
            CommandTypeImportCommand::class,
            CommandTypeListCommand::class,
            CommandTypeProposeCommand::class,
            CommandTypeRejectCommand::class,
            CommandTypeRestoreCommand::class,
            CommandTypeRetireCommand::class,
            CommandTypeReviseCommand::class,
            CommandTypeShowCommand::class,
            CommandTypeWithdrawCommand::class,
            RunProcessCommand::class,
            OutputReadCommand::class,
            ProcessShowCommand::class,
            ProcessExportCommand::class,
            ReaderProposeCommand::class,
            ReaderProveCommand::class,
            ProcessReconcileCommand::class,
            ProcessCleanCommand::class,
            ProcessRestoreCheckCommand::class,
            ReaderSampleApproveCommand::class,
            ReaderSampleRunCommand::class,
        ]);
    }
}
