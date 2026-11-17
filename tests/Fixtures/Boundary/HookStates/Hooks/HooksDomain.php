<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\HookStates\Hooks;

use App\Domain\Domain;

final class HooksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture Hooks domain with hook inputs and events.';
    }

    public function requires(): array
    {
        return [];
    }
}
