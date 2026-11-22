<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\HostOperatorAccess;
use App\Contracts\LocalProjectHosts;
use App\Contracts\PolicyCatalogue;
use App\Enums\AccessType;
use App\Policies\ConnectionsPolicy;
use App\Support\BindingHosts;
use App\Support\CommandRunEvidence;
use App\Support\ConnectionsHostOperatorAccess;
use App\Support\EntryDispatchers;
use App\Support\JournalRoutes;
use App\Support\ProjectCommands;
use App\Values\PolicyDefinition;
use Illuminate\Support\ServiceProvider;

/**
 * Connects projects on other machines to this journal: the owner's install lines, the URL each one opens and the
 * script it serves.
 */
final class ConnectionsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LocalProjectHosts::class, BindingHosts::class);
        $this->app->bind(HostOperatorAccess::class, ConnectionsHostOperatorAccess::class);

        $this->app->bind(ProjectCommands::class, fn () => new ProjectCommands(
            $this->app->make(JournalRoutes::class),
            $this->app->make(EntryDispatchers::class),
            $this->app->make(CommandRunEvidence::class),
            base_path('artisan'),
            $this->app->make('config')->string('app.url'),
        ));
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register('Core', new PolicyDefinition(
            ConnectionsPolicy::class,
            [AccessType::Create, AccessType::Edit],
        ));

        $this->loadRoutesFrom(dirname(__DIR__, 2).'/routes/connections/connections.php');
    }
}
