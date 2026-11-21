<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Handlers;

use Tests\Fixtures\EventProducers\Models\FixtureTask;

/**
 * A handler that calls the owning mutation and sends nothing itself.
 */
final readonly class CallsMutationHandler
{
    public function handle(FixtureTask $task): void
    {
        $task->finish();
    }
}
