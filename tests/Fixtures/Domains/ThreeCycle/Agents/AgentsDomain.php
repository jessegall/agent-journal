<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ThreeCycle\Agents;

use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Domains\ThreeCycle\Chat\ChatDomain;

final class AgentsDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of three.';
    }

    public function requires(): array
    {
        return [ChatDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
