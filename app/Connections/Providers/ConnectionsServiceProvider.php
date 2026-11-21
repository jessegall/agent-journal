<?php

declare(strict_types=1);

namespace App\Connections\Providers;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Values\PolicyDefinition;
use App\Bus\Support\EntryDispatchers;
use App\Connections\Policies\ConnectionsPolicy;
use App\Connections\Support\ProjectCommands;
use App\Operations\Enums\AccessType;
use App\Processes\Support\JournalRoutes;
use Illuminate\Support\ServiceProvider;

/**
 * Connects projects on other machines to this journal: the owner's install lines, the URL each one opens and the
 * script it serves.
 */
final class ConnectionsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProjectCommands::class, fn () => new ProjectCommands(
            $this->app->make(JournalRoutes::class),
            $this->app->make(EntryDispatchers::class),
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

        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/connections.php');
    }
}
