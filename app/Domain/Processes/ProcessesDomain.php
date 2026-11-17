<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Domain\Domain;
use App\Domain\Hooks\HooksDomain;
use App\Domain\Links\LinksDomain;

final class ProcessesDomain implements Domain
{
    public function description(): string
    {
        return 'Shell commands run through the journal, their output, saved commands and readers.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [HooksDomain::class, LinksDomain::class];
    }
}
