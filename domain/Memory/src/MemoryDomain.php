<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesBootstrappers;

final class MemoryDomain implements Domain, ProvidesBootstrappers
{
    public function description(): string
    {
        return 'The weighted memories each agent keeps past its context window.';
    }

    /**
     * @return list<class-string<Domain>>
     */
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
