<?php

declare(strict_types=1);

namespace App\Providers;

use App\Agents\Drivers\Processes\HeadlessDriver;
use App\Agents\Drivers\Processes\ProbeDriver;
use App\Agents\Drivers\Processes\ProcessDrivers;
use App\Agents\Drivers\Processes\TerminalDriver;
use App\Agents\Drivers\Work\WorkerLease;
use App\Commands\Hosts\MarkSilentHosts\MarkSilentHostsCommand;
use App\Commands\Hosts\SweepHostOrders\SweepHostOrdersCommand;
use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Hosts\HostChannel as HostChannelContract;
use App\Contracts\Hosts\HostOperatorAccess as HostOperatorAccessContract;
use App\Contracts\Hosts\LocalProjectHosts as LocalProjectHostsContract;
use App\Contracts\Hosts\ProjectFiles as ProjectFilesContract;
use App\Contracts\Projects\AgentProjects;
use App\Contracts\Projects\CurrentProject as CurrentProjectContract;
use App\Contracts\Projects\FileComments;
use App\Contracts\Projects\HeldFileVersions;
use App\Contracts\Projects\ProjectDestination as ProjectDestinationContract;
use App\Contracts\Projects\ProjectDirectory as ProjectDirectoryContract;
use App\Contracts\Records\RecordProviderRegistration;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\AccessType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Models\Projects\ProjectFile;
use App\Policies\ConnectionsPolicy;
use App\Policies\ProjectFilesPolicy;
use App\Resolvers\AgentDirectory;
use App\Support\CommandRunEvidence;
use App\Support\HostOperatorAccess;
use App\Support\Hosts\HostChannel;
use App\Support\JournalCommands;
use App\Support\JournalRoutes;
use App\Support\Links\ProjectFileLinkRecords;
use App\Support\LocalProjectHosts;
use App\Support\NoFileComments;
use App\Support\NoHeldFileVersions;
use App\Support\ProjectCommands;
use App\Support\ProjectFiles;
use App\Support\ProjectReadRetentionService;
use App\Support\Projects\CurrentProject;
use App\Support\Projects\ProjectDestination;
use App\Support\Projects\ProjectDirectory;
use App\Values\PolicyDefinition;
use Carbon\CarbonImmutable;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\ServiceProvider;

/**
 * Connects projects on other machines to this journal: the owner's install lines, the URL each one opens and the
 * script it serves.
 */
final class ConnectionsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(LocalProjectHostsContract::class, LocalProjectHosts::class);
        $this->app->bind(HostChannelContract::class, HostChannel::class);

        // Each purpose of process the journal drives has its process driver; a test adds its stand-in drivers.
        $this->app->singleton(ProcessDrivers::class, fn ($app) => new ProcessDrivers($app)
            ->with(HostProcessPurpose::AgentTurn, HeadlessDriver::class)
            ->with(HostProcessPurpose::AgentTerminal, TerminalDriver::class)
            ->with(HostProcessPurpose::BuildProbe, ProbeDriver::class)
            ->with(HostProcessPurpose::SignInProbe, ProbeDriver::class));

        $this->app->singleton(WorkerLease::class);
        $this->app->bind(HostOperatorAccessContract::class, HostOperatorAccess::class);
        $this->app->bind(ProjectFilesContract::class, ProjectFiles::class);
        $this->app->bindIf(FileComments::class, NoFileComments::class);
        $this->app->bindIf(HeldFileVersions::class, NoHeldFileVersions::class);
        $this->app->bind(CurrentProjectContract::class, CurrentProject::class);
        $this->app->bind(AgentProjects::class, AgentDirectory::class);
        $this->app->bind(ProjectDestinationContract::class, ProjectDestination::class);
        $this->app->bind(ProjectDirectoryContract::class, ProjectDirectory::class);

        $this->app->bind(ProjectCommands::class, fn () => new ProjectCommands(
            $this->app->make(JournalRoutes::class),
            $this->app->make(JournalCommands::class),
            $this->app->make(CommandRunEvidence::class),
            base_path('artisan'),
            $this->app->make('config')->string('app.url'),
        ));
    }

    public function boot(
        PolicyCatalogue $policies,
        RecordProviderRegistration $records,
    ): void {
        $policies->register('Core', new PolicyDefinition(
            ConnectionsPolicy::class,
            [AccessType::Read, AccessType::Create, AccessType::Edit],
        ));

        $policies->register('Core', new PolicyDefinition(ProjectFilesPolicy::class, [AccessType::Read]));

        $records->register(ProjectFile::linkType(), ProjectFileLinkRecords::class);

        $this->loadCoreRoutes('connections/connections.php');

        $this->callAfterResolving(Schedule::class, function (Schedule $schedule): void {
            $schedule
                ->call(fn (ProjectReadRetentionService $pruning) => $pruning->prune(CarbonImmutable::now()))
                ->everyMinute();

            $schedule
                ->call(fn (JournalCommands $commands) => $commands->runAsJournal(
                    CommandEntry::HostControl,
                    'silent host check',
                    new MarkSilentHostsCommand(),
                ))
                ->everyThirtySeconds();

            $schedule
                ->call(fn (JournalCommands $commands) => $commands->runAsJournal(
                    CommandEntry::HostControl,
                    'host order sweep',
                    new SweepHostOrdersCommand(),
                ))
                ->everyThirtySeconds();
        });
    }
}
