<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\CommandTypeImportCommand;
use App\Console\Commands\CommandTypeListCommand;
use App\Console\Commands\CommandTypeProposeCommand;
use App\Console\Commands\CommandTypeReviseCommand;
use App\Console\Commands\CommandTypeShowCommand;
use App\Console\Commands\CommandTypeWithdrawCommand;
use App\Console\Commands\ExplainCommandTypeCommand;
use App\Console\Commands\OutputReadCommand;
use App\Console\Commands\ProcessExportCommand;
use App\Console\Commands\ProcessReconcileCommand;
use App\Console\Commands\ProcessShowCommand;
use App\Console\Commands\ReaderProposeCommand;
use App\Console\Commands\ReaderProveCommand;
use App\Console\Commands\ReaderSampleRunCommand;
use App\Console\Commands\RunProcessCommand;
use App\Contracts\Actors\AliasResolver as AliasResolverContract;
use App\Contracts\Admission\ShellAdmission as ShellAdmissionContract;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Bus\CommandClassifier as CommandClassifierContract;
use App\Contracts\Bus\ResultReceipts as ResultReceiptsContract;
use App\Contracts\Hosts\ServedEnvironment as ServedEnvironmentContract;
use App\Contracts\Notifications\NotificationTargets;
use App\Contracts\Processes\ProcessRunResolver as ProcessRunResolverContract;
use App\Contracts\Processes\ShellCommandParser as ShellCommandParserContract;
use App\Contracts\Reads\OutputRecorder as OutputRecorderContract;
use App\Contracts\Time\VerificationTiming;
use App\Enums\Agents\AccessType;
use App\Models\Runs\ProcessRun;
use App\Policies\ProcessAdministrationPolicy;
use App\Policies\ProcessPolicy;
use App\Resolvers\RunNotificationTarget;
use App\Support\ActiveRules;
use App\Support\Admission\ShellAdmission;
use App\Support\AliasResolver;
use App\Support\Classification\CommandClassifier;
use App\Support\CommandRuleRegistry;
use App\Support\JournalRoutes;
use App\Support\OpenTiming;
use App\Support\OutputDocking;
use App\Support\OutputRecorder;
use App\Support\ProcessRunResolver;
use App\Support\ProgramClassifiers;
use App\Support\ProjectRules;
use App\Support\ReceiptPublisher;
use App\Support\RequiredServices;
use App\Support\ResultReceipts;
use App\Support\Rules\ProgramClassifier;
use App\Support\RunDocking;
use App\Support\ServedEnvironment;
use App\Support\ShellCommandParser;
use App\Support\Sources\Contracts\DockRegistration;
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
        $this->app->scoped(ShellCommandParserContract::class, ShellCommandParser::class);
        $this->app->singleton(TreeParser::class);
        $this->app->scoped(CommandClassifierContract::class, CommandClassifier::class);
        $this->app->scoped(ServedEnvironment::class);
        $this->app->scoped(ServedEnvironmentContract::class, fn ($app) => $app->make(ServedEnvironment::class));
        $this->app->scoped(ProjectRules::class);
        $this->app->scoped(ActiveRules::class);
        $this->app->scoped(ShellAdmissionContract::class, ShellAdmission::class);
        $this->app->scoped(VerificationTiming::class, OpenTiming::class);
        $this->app->scoped(ReceiptPublisher::class);
        $this->app->scoped(ResultReceiptsContract::class, ResultReceipts::class);
        $this->app->scoped(ProcessRunResolverContract::class, ProcessRunResolver::class);

        $this->app->when(CommandClassifier::class)
            ->needs(CommandRuleRegistry::class)
            ->give(fn (Application $app): CommandRuleRegistry => $app->make(ActiveRules::class)->registry());

        $this->app->scoped(AliasResolverContract::class, AliasResolver::class);
        $this->app->scoped(OutputRecorderContract::class, OutputRecorder::class);

        $this->app->singleton(
            JournalRoutes::class,
            fn (Application $app) => JournalRoutes::fromCommands($app->make(ConsoleKernel::class)->all()),
        );

        $this->app->scoped(ProgramClassifiers::class, fn (Application $app) => new ProgramClassifiers([
            new ProgramClassifier($app->make(JournalRoutes::class), $app->basePath('bin/journal')),
        ]));
    }

    public function boot(
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

        $this->loadCoreRoutes('processes/processes.php');

        $this->commands([
            ExplainCommandTypeCommand::class,
            CommandTypeImportCommand::class,
            CommandTypeListCommand::class,
            CommandTypeProposeCommand::class,
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
            ReaderSampleRunCommand::class,
        ]);
    }
}
