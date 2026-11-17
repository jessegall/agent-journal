<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ThreeCycle\Hooks;

use App\Domains\Domain;
use Tests\Fixtures\Domains\ThreeCycle\Agents\AgentsDomain;

final class HooksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of three.';
    }

    public function requires(): array
    {
        return [AgentsDomain::class];
    }
}
