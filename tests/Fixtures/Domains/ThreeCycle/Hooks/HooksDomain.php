<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ThreeCycle\Hooks;

use App\Domains\Support\Domain;
use Tests\Fixtures\Domains\ThreeCycle\Agents\AgentsDomain;

final class HooksDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of three.';
    }

    public function requires(): array
    {
        return [AgentsDomain::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
