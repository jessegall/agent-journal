<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Senders;

use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\EventProducers\Events\FixtureChanged;

/**
 * The support service a handler forwards its send to: the one listed producer of FixtureChanged.
 */
final readonly class Forwarder
{
    public function __construct(private Dispatcher $events) {}

    public function changed(string $taskId): void
    {
        $this->events->dispatch(new FixtureChanged($taskId));
    }
}
