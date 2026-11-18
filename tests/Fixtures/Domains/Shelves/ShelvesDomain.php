<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves;

use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesBootstrappers;

final class ShelvesDomain implements Domain, ProvidesBootstrappers
{
    public function description(): string
    {
        return 'A fixture domain with a migration and a listener.';
    }

    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }

    public function bootstrappers(): array
    {
        return [LoadMigrations::class];
    }
}
