<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\ProcessFeed;

/**
 * A host process that exited or was lost tells its driver worker through its feed, so a worker that waits on the feed
 * needs no read of its own to learn it.
 */
final readonly class MarkFeedOnProcessEnd implements Listener
{
    public function __construct(private ProcessFeed $feed) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $this->feed->markEnded($fact->processId);
    }
}
