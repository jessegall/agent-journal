<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Events;

use App\Contracts\Event;

/**
 * An event not migrated yet, whose one listed producer is the forwarding support service.
 */
final readonly class FixtureChanged implements Event
{
    public function __construct(public string $taskId) {}

    public static function forTask(string $taskId): self
    {
        return new self($taskId);
    }
}
