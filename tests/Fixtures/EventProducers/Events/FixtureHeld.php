<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Events;

use App\Contracts\Event;
use Tests\Fixtures\EventProducers\Models\FixtureTask;

/**
 * A migrated fact that holds a model, which a queued payload cannot carry.
 */
final readonly class FixtureHeld implements Event
{
    public function __construct(public FixtureTask $task) {}
}
