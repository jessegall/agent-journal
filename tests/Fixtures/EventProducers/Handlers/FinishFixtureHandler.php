<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Handlers;

use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\EventProducers\Events\FixtureFinished;
use Tests\Fixtures\EventProducers\Models\FixtureTask;

/**
 * The shape of FinishTaskHandler: it calls the owning mutation, then sends the migrated fact a second time.
 */
final readonly class FinishFixtureHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(FixtureTask $task): void
    {
        $task->finish();
        $this->events->dispatch(new FixtureFinished((string) $task->id));
    }
}
