<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Hosts\HostOperatorAccess;
use App\Contracts\Hosts\LocalProjectHosts;
use App\Contracts\Hosts\ProjectFiles;
use App\Contracts\Records\RecordProviderRegistration;
use App\Enums\Agents\AccessType;
use App\Models\Projects\ProjectFile;
use App\Policies\ConnectionsPolicy;
use App\Policies\ProjectFilesPolicy;
use App\Support\BindingHosts;
use App\Support\CommandRunEvidence;
use App\Support\ConnectionsHostOperatorAccess;
use App\Support\EntryDispatchers;
use App\Support\HostProjectFiles;
use App\Support\JournalRoutes;
use App\Support\Links\ProjectFileLinkRecords;
use App\Support\ProjectCommands;
use App\Support\ProjectReadRetentionService;
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
        $this->app->bind(LocalProjectHosts::class, BindingHosts::class);
        $this->app->bind(HostOperatorAccess::class, ConnectionsHostOperatorAccess::class);
        $this->app->bind(ProjectFiles::class, HostProjectFiles::class);

        $this->app->bind(ProjectCommands::class, fn () => new ProjectCommands(
            $this->app->make(JournalRoutes::class),
            $this->app->make(EntryDispatchers::class),
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
            [
                AccessType::Read,
                AccessType::Create,
                AccessType::Edit,
            ],
        ));

        $policies->register('Core', new PolicyDefinition(ProjectFilesPolicy::class, [AccessType::Read]));

        $records->register(ProjectFile::linkType(), ProjectFileLinkRecords::class);

        $this->loadCoreRoutes('connections/connections.php');

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule
                ->call(fn (ProjectReadRetentionService $pruning) => $pruning->prune(CarbonImmutable::now()))
                ->everyMinute(),
        );
    }
}
