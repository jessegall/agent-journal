<?php

declare(strict_types=1);

namespace App\Domain\Memory;

use App\Domain\Domain;
use App\Domain\Hooks\HooksDomain;
use App\Domain\Links\LinksDomain;

final class MemoryDomain implements Domain
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
        return [HooksDomain::class, LinksDomain::class];
    }
}
