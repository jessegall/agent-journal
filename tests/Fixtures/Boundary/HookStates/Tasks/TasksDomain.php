<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\HookStates\Tasks;

use App\Domain\Domain;
use Tests\Fixtures\Boundary\HookStates\Hooks\HooksDomain;

final class TasksDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture Tasks domain that owns a state for the stack.';
    }

    public function requires(): array
    {
        return [HooksDomain::class];
    }
}
