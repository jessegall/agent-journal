<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ThreeCycle\Agents;

use App\Domain\Domain;
use Tests\Fixtures\Domains\ThreeCycle\Chat\ChatDomain;

final class AgentsDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of three.';
    }

    public function requires(): array
    {
        return [ChatDomain::class];
    }
}
