<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Senders;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Event as Events;
use Tests\Fixtures\EventProducers\Events\FixtureChanged;

/**
 * Sends of an event from a file its list does not name: by a facade alias, a variable and a factory.
 */
final readonly class OtherSenders
{
    public function __construct(private Dispatcher $events) {}

    public function byFacadeAlias(string $taskId): void
    {
        Events::dispatch(new FixtureChanged($taskId));
    }

    public function byVariable(string $taskId): void
    {
        $changed = new FixtureChanged($taskId);
        $this->events->dispatch($changed);
    }

    public function byFactory(string $taskId): void
    {
        $this->events->dispatch(FixtureChanged::forTask($taskId));
    }
}
