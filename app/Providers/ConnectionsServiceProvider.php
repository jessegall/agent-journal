<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Values\PolicyDefinition;
use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Codex\CodexAppDriver;
use App\Agents\Drivers\Processes\HeadlessDriver;
use App\Agents\Drivers\Processes\ProbeDriver;
use App\Agents\Drivers\Processes\ProcessDrivers;
use App\Agents\Drivers\Processes\TerminalDriver;
use App\Agents\Drivers\Work\WorkerLease;
use App\Agents\Enums\AccessType;
use App\Bus\JournalCommands;
use App\Bus\JournalRoutes;
use App\Concerns\LoadsCoreRoutes;
use App\Hosts\Commands\MarkFailedUpgrades\MarkFailedUpgradesCommand;
use App\Hosts\Commands\MarkSilentHosts\MarkSilentHostsCommand;
use App\Hosts\Commands\SweepHostOrders\SweepHostOrdersCommand;
use App\Hosts\Contracts\HostChannel as HostChannelContract;
use App\Hosts\Contracts\HostOperatorAccess as HostOperatorAccessContract;
use App\Hosts\Contracts\LocalProjectHosts as LocalProjectHostsContract;
use App\Hosts\Contracts\ProjectFiles as ProjectFilesContract;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\HostChannel;
use App\Hosts\HostOperatorAccess;
use App\Links\ProjectFileLinkRecords;
use App\Models\Projects\ProjectFile;
use App\Policies\ConnectionsPolicy;
use App\Policies\ProjectFilesPolicy;
use App\Projects\CommandRunEvidence;
use App\Projects\Contracts\AgentProjects;
use App\Projects\Contracts\CurrentProject as CurrentProjectContract;
use App\Projects\Contracts\FileComments;
use App\Projects\Contracts\HeldFileVersions;
use App\Projects\Contracts\ProjectDestination as ProjectDestinationContract;
use App\Projects\Contracts\ProjectDirectory as ProjectDirectoryContract;
use App\Projects\Contracts\ProjectEdges as ProjectEdgesContract;
use App\Projects\CurrentProject;
use App\Projects\LocalProjectHosts;
use App\Projects\NoFileComments;
use App\Projects\NoHeldFileVersions;
use App\Projects\ProjectCommands;
use App\Projects\ProjectDestination;
use App\Projects\ProjectDirectory;
use App\Projects\ProjectEdges;
use App\Projects\ProjectFiles;
use App\Projects\ProjectReadRetentionService;
use App\Records\Contracts\RecordProviderRegistration;
use App\Resolvers\AgentDirectory;
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
        $this->app->bind(ProjectEdgesContract::class, ProjectEdges::class);
        $this->app->bind(LocalProjectHostsContract::class, LocalProjectHosts::class);
        $this->app->bind(HostChannelContract::class, HostChannel::class);

        // Each purpose of process the journal drives has its process driver; a test adds its mock drivers.
        $this->app->singleton(ProcessDrivers::class, fn ($app) => new ProcessDrivers($app)
            ->with(HostProcessPurpose::AgentTurn, HeadlessDriver::class)
            ->with(HostProcessPurpose::AgentTerminal, TerminalDriver::class)
            ->with(HostProcessPurpose::AccountOwner, CodexAppDriver::class)
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
                    'failed upgrade check',
                    new MarkFailedUpgradesCommand(),
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
