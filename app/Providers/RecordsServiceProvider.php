<?php

declare(strict_types=1);

namespace App\Providers;

use App\Concerns\LoadsCoreRoutes;
use App\Console\Commands\LinkAddCommand;
use App\Console\Commands\LinkRemoveCommand;
use App\Contracts\Actors\IdentityLinks;
use App\Contracts\Authorization\PolicyCatalogue;
use App\Contracts\Records\RecordLinker;
use App\Contracts\Records\RecordProviderRegistration;
use App\Contracts\Records\RecordResolver;
use App\Enums\Agents\AccessType;
use App\Models\Records\Link;
use App\Policies\RecordLinkPolicy;
use App\Support\Docking\RecordFallbackDocks;
use App\Support\RecordProviders;
use App\Support\Sources\Contracts\FallbackDocks;
use App\Support\TransactionalIdentityLinks;
use App\Support\TransactionalRecordLinker;
use App\Values\PolicyDefinition;
use Illuminate\Support\ServiceProvider;

/**
 * Serves the routes and the link:add and link:remove commands that read and link records of every domain.
 */
final class RecordsServiceProvider extends ServiceProvider
{
    use LoadsCoreRoutes;

    public function register(): void
    {
        $this->app->bind(RecordLinker::class, TransactionalRecordLinker::class);
        $this->app->bind(IdentityLinks::class, TransactionalIdentityLinks::class);
        $this->app->bind(RecordProviderRegistration::class, RecordProviders::class);
        $this->app->bind(RecordResolver::class, RecordProviders::class);
        $this->app->bind(FallbackDocks::class, RecordFallbackDocks::class);
    }

    public function boot(PolicyCatalogue $policies): void
    {
        $policies->register(
            'Core',
            new PolicyDefinition(RecordLinkPolicy::class, [
                AccessType::Create,
                AccessType::Edit,
            ]),
        );

        $this->loadCoreRoutes('records/links.php');

        if ($this->app->runningInConsole()) {
            $this->commands([
                LinkAddCommand::class,
                LinkRemoveCommand::class,
            ]);
        }
    }
}
