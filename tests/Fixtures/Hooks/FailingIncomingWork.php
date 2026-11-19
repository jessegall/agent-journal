<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\IncomingWork;
use Tests\Support\SimulatedFailure;

/**
 * Incoming work whose source is down, so a hook that accepts it fails before the stack is touched.
 */
final class FailingIncomingWork implements IncomingWork
{
    public function accept(): void
    {
        throw SimulatedFailure::of('The inbox is unreachable.');
    }
}
