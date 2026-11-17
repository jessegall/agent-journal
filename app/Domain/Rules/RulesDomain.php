<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Domain\Domain;
use App\Domain\Hooks\HooksDomain;
use App\Domain\Links\LinksDomain;

final class RulesDomain implements Domain
{
    public function description(): string
    {
        return 'The standing project rules every agent is told.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [HooksDomain::class, LinksDomain::class];
    }
}
