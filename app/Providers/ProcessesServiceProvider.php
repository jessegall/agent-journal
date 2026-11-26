<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Contracts\ShellAdmission as ShellAdmissionContract;
use App\Access\ShellAdmission;
use App\Access\Values\PolicyDefinition;
use App\Actors\Contracts\AliasResolver as AliasResolverContract;
use App\Agents\Enums\AccessType;
use App\Bus\Contracts\CommandClassifier as CommandClassifierContract;
use App\Bus\Contracts\ResultReceipts as ResultReceiptsContract;
use App\Bus\JournalRoutes;
use App\CommandRules\ActiveRules;
use App\CommandRules\CommandRuleRegistry;
use App\CommandRules\ProgramClassifiers;
use App\CommandRules\ProjectRules;
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
use App\Hosts\Contracts\ServedEnvironment as ServedEnvironmentContract;
use App\Notifications\Contracts\NotificationTargets;
use App\Policies\ProcessAdministrationPolicy;
use App\Policies\ProcessPolicy;
use App\Processes\AliasResolver;
use App\Processes\Contracts\ProcessRunResolver as ProcessRunResolverContract;
use App\Processes\Contracts\ShellCommandParser as ShellCommandParserContract;
use App\Processes\OutputRecorder;
use App\Processes\ProcessRunResolver;
use App\Processes\ReceiptPublisher;
use App\Processes\RequiredServices;
use App\Processes\Resolvers\RunNotificationTarget;
use App\Processes\ResultReceipts;
use App\Processes\ShellCommandParser;
use App\Projects\ServedEnvironment;
use App\Reads\Contracts\OutputRecorder as OutputRecorderContract;
use App\Support\Classification\CommandClassifier;
use App\Support\Rules\ProgramClassifier;
use App\Support\Syntax\TreeParser;
use App\Time\Contracts\VerificationTiming;
use App\Time\OpenTiming;
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
        NotificationTargets $notificationTargets,
    ): void {
        $notificationTargets->register(RunNotificationTarget::KEY, RunNotificationTarget::class);

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
