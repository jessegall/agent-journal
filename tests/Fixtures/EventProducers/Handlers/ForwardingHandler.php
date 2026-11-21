<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Handlers;

use Tests\Fixtures\EventProducers\Senders\Forwarder;

/**
 * A handler that leaves the send to a support service.
 */
final readonly class ForwardingHandler
{
    public function __construct(private Forwarder $forwarder) {}

    public function handle(string $taskId): void
    {
        $this->forwarder->changed($taskId);
    }
}
