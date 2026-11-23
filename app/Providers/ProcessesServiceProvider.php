<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\CommandTypeApproveCommand;
use App\Console\Commands\CommandTypeImportCommand;
use App\Console\Commands\CommandTypeListCommand;
use App\Console\Commands\CommandTypeProposeCommand;
use App\Console\Commands\CommandTypeRejectCommand;
use App\Console\Commands\CommandTypeRestoreCommand;
use App\Console\Commands\CommandTypeRetireCommand;
use App\Console\Commands\CommandTypeReviseCommand;
use App\Console\Commands\CommandTypeShowCommand;
use App\Console\Commands\CommandTypeWithdrawCommand;
use App\Console\Commands\ExplainCommandTypeCommand;
use App\Console\Commands\OutputReadCommand;
use App\Console\Commands\ProcessCleanCommand;
use App\Console\Commands\ProcessExportCommand;
use App\Console\Commands\ProcessReconcileCommand;
use App\Console\Commands\ProcessRestoreCheckCommand;
use App\Console\Commands\ProcessShowCommand;
use App\Console\Commands\ReaderProposeCommand;
use App\Console\Commands\ReaderProveCommand;
use App\Console\Commands\ReaderSampleApproveCommand;
use App\Console\Commands\ReaderSampleRunCommand;
use App\Console\Commands\RunProcessCommand;
use App\Contracts\Actors\AliasResolver;
use App\Contracts\Admission\ShellAdmission;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Bus\CommandClassifier;
use App\Contracts\Bus\ResultReceipts;
use App\Contracts\Chat\NotificationTargets;
use App\Contracts\Hosts\ServedEnvironment;
use App\Contracts\Processes\ProcessRunCallers;
use App\Contracts\Processes\ShellCommandParser;
use App\Contracts\Reads\OutputRecorder;
use App\Contracts\Time\VerificationTiming;
use App\Enums\AccessType;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\CommandAlias;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use App\Models\Profiles\PermissionRevocation;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessEvent;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ReaderPosition;
use App\Models\Runs\ReaderProof;
use App\Models\Runs\ReaderRevision;
use App\Models\Runs\ResultReceipt;
use App\Policies\ProcessAdministrationPolicy;
use App\Policies\ProcessPolicy;
use App\Resolvers\RunNotificationTarget;
use App\Support\ActiveRules;
use App\Support\Admission\LineAdmission;
use App\Support\Classification\TreeClassifier;
use App\Support\CommandAliases;
use App\Support\CommandRuleRegistry;
use App\Support\JournalRoutes;
use App\Support\LinkTypeRegistry;
use App\Support\OpenTiming;
use App\Support\OutputDocking;
use App\Support\ProgramClassifiers;
use App\Support\ProjectKey;
use App\Support\ProjectReceipts;
use App\Support\ProjectRules;
use App\Support\ProjectRunCallers;
use App\Support\ReceiptPublisher;
use App\Support\RequiredServices;
use App\Support\Rules\JournalClassifier;
use App\Support\RunDocking;
use App\Support\ShellParser;
use App\Support\Sources\Contracts\DockRegistration;
use App\Support\SpoolRecorder;
use App\Support\Syntax\TreeParser;
use App\Values\DockedOutput;
use App\Values\PolicyDefinition;
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
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->scoped(ShellCommandParser::class, ShellParser::class);
        $this->app->singleton(TreeParser::class);
        $this->app->scoped(CommandClassifier::class, TreeClassifier::class);
        $this->app->scoped(ProjectKey::class);
        $this->app->scoped(ServedEnvironment::class, fn ($app) => $app->make(ProjectKey::class));
        $this->app->scoped(ProjectRules::class);
        $this->app->scoped(ActiveRules::class);
        $this->app->scoped(ShellAdmission::class, LineAdmission::class);
        $this->app->scoped(VerificationTiming::class, OpenTiming::class);
        $this->app->scoped(ReceiptPublisher::class);
        $this->app->scoped(ResultReceipts::class, ProjectReceipts::class);
        $this->app->scoped(ProcessRunCallers::class, ProjectRunCallers::class);

        $this->app->when(TreeClassifier::class)
            ->needs(CommandRuleRegistry::class)
            ->give(fn (Application $app): CommandRuleRegistry => $app->make(ActiveRules::class)->registry());

        $this->app->scoped(AliasResolver::class, CommandAliases::class);
        $this->app->scoped(OutputRecorder::class, SpoolRecorder::class);

        $this->app->singleton(
            JournalRoutes::class,
            fn (Application $app) => JournalRoutes::fromCommands($app->make(ConsoleKernel::class)->all()),
        );

        $this->app->scoped(ProgramClassifiers::class, fn (Application $app) => new ProgramClassifiers([
            new JournalClassifier($app->make(JournalRoutes::class), $app->basePath('bin/journal')),
        ]));
    }

    public function boot(
        LinkTypeRegistry $links,
        PolicyCatalogue $policies,
        DockRegistration $docks,
        NotificationTargets $notificationTargets,
    ): void {
        $notificationTargets->register(RunNotificationTarget::KEY, RunNotificationTarget::class);
        $docks->offerDockFor($docks->register(ProcessRun::DOCK_TYPE, ProcessRun::class, RunDocking::class));
        $docks->offerDockFor($docks->register(OutputDocking::DOCK_TYPE, DockedOutput::class, OutputDocking::class));

        $policies->register('Core', new PolicyDefinition(
            ProcessPolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Execute, AccessType::Test],
        ));

        $policies->register('Core', new PolicyDefinition(
            ProcessAdministrationPolicy::class,
            [AccessType::Create, AccessType::Edit, AccessType::Test],
        ));

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

        $this->loadCoreRoutes('processes/processes.php');

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
