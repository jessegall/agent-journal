<?php

declare(strict_types=1);

namespace Domain\Processes;

use App\Domains\Bootstrappers\LoadMigrations;
use App\Domains\Contracts\Domain;
use App\Domains\Contracts\ProvidesBootstrappers;

final class ProcessesDomain implements Domain, ProvidesBootstrappers
{
    public function description(): string
    {
        return 'Shell commands run through the journal, their output, command aliases and readers.';
    }

    public function bootstrappers(): array
    {
        return [LoadMigrations::class];
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
}
