<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Books;

use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesBootstrappers;

final class BooksDomain implements Domain, ProvidesBootstrappers
{
    public function description(): string
    {
        return 'A fixture domain with a migration of its own.';
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
