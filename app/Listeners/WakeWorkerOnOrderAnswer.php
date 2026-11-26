<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Contracts\Hosts\HostOrderAnswerEvent;
use App\Support\Hosts\ProcessFeed;

/**
 * Once a host's answer to an order is committed, the worker of its process hears it on the process's feed.
 */
final readonly class WakeWorkerOnOrderAnswer implements Listener
{
    public function __construct(private ProcessFeed $feed) {}

    public function handle(HostOrderAnswerEvent $fact): void
    {
        if ($fact->processId === null) {
            return;
        }

        $this->feed->markOrder($fact->processId, $fact->orderId);
    }
}
