<?php

declare(strict_types=1);

namespace App\Support\Bootstrappers;

use App\Contracts\Domains\DomainBootstrapper;
use App\Support\DomainEntry;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\Migrations\Migrator;

/**
 * Adds the domain's migration folder to the ones migrate runs.
 */
final readonly class MigrationsBootstrapper implements DomainBootstrapper
{
    public function __construct(private Application $app) {}

    public function __invoke(DomainEntry $domain): void
    {
        $this->app->afterResolving('migrator', fn (Migrator $migrator) => $migrator->path($domain->migrationFolder()));

        if ($this->app->resolved('migrator')) {
            $this->app->make('migrator')->path($domain->migrationFolder());
        }
    }
}
