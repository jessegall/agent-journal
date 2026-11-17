<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\HookStates\Hooks\Inputs;

final readonly class StopRequested
{
    public function __construct(public string $sessionId) {}
}
