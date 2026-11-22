<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Events;

use App\Contracts\Events\Event;

/**
 * A migrated row fact: only FixtureTask::finish raises it.
 */
final readonly class FixtureFinished implements Event
{
    public function __construct(public string $taskId) {}
}
