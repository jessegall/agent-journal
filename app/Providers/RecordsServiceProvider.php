<?php

declare(strict_types=1);

namespace App\Providers;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Values\PolicyDefinition;
use App\Actors\Contracts\IdentityLinks as IdentityLinksContract;
use App\Agents\Enums\AccessType;
use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\LinkAddCommand;
use App\Console\Commands\LinkRemoveCommand;
use App\Links\IdentityLinks;
use App\Links\RecordLinker;
use App\Policies\RecordLinkPolicy;
use App\Records\Contracts\RecordLinker as RecordLinkerContract;
use App\Records\Contracts\RecordProviderRegistration;
use App\Records\Contracts\RecordResolver;
use App\Records\Contracts\RecordSummaries as RecordSummariesContract;
use App\Records\RecordProviders;
use App\Records\RecordSummaries;
use Illuminate\Support\ServiceProvider;

/**
 * Serves the routes and the link:add and link:remove commands that read and link records of every domain, and the
 * registry of record summaries.
 */
final class RecordsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(RecordLinkerContract::class, RecordLinker::class);
        $this->app->bind(IdentityLinksContract::class, IdentityLinks::class);
        $this->app->bind(RecordProviderRegistration::class, RecordProviders::class);
        $this->app->bind(RecordResolver::class, RecordProviders::class);
        $this->app->bind(RecordSummariesContract::class, RecordSummaries::class);
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register(
            'Core',
            new PolicyDefinition(RecordLinkPolicy::class, [AccessType::Create, AccessType::Edit]),
        );

        $this->loadCoreRoutes('records/links.php');

        if ($this->app->runningInConsole()) {
            $this->commands([LinkAddCommand::class, LinkRemoveCommand::class]);
        }
    }
}
