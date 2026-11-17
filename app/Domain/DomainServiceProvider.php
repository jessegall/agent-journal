<?php

declare(strict_types=1);

namespace App\Domain;

use App\Core\Hooks\Events\StateTypesRequested;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the domains of bootstrap/domains.php: their registry, listener folders, migrations and the states they declare.
 */
class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $registry = DomainRegistry::from($this->domainClasses());

        $this->app->instance(DomainRegistry::class, $registry);

        EventServiceProvider::addEventDiscoveryPaths($registry->listenerFolders());
    }

    public function boot(DomainRegistry $registry, Dispatcher $events): void
    {
        foreach ($registry->all() as $entry) {
            $this->loadMigrationsFrom($entry->migrationFolder());
        }

        $events->listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $registry->registerStatesIn($event->registry, $this->app));
    }

    /**
     * @return list<string>
     */
    protected function domainClasses(): array
    {
        return require $this->app->basePath('bootstrap/domains.php');
    }
}
