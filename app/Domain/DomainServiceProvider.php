<?php

declare(strict_types=1);

namespace App\Domain;

use Illuminate\Foundation\Support\Providers\EventServiceProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Registers the domains of bootstrap/domains.php: their registry, listener folders and migrations.
 */
class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $registry = DomainRegistry::from($this->domainClasses());

        $this->app->instance(DomainRegistry::class, $registry);

        EventServiceProvider::addEventDiscoveryPaths($registry->listenerFolders());
    }

    public function boot(DomainRegistry $registry): void
    {
        foreach ($registry->all() as $entry) {
            $this->loadMigrationsFrom($entry->migrationFolder());
        }
    }

    /**
     * @return list<string>
     */
    protected function domainClasses(): array
    {
        return require $this->app->basePath('bootstrap/domains.php');
    }
}
