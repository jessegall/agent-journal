<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Inboxes\InboxLeft;
use App\Events\Web\InboxAccessEnded;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * A user who leaves an inbox is told at once, so an open page drops it.
 */
final readonly class NotifyInboxAccessEnded implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(InboxLeft $event): void
    {
        if ($event->actor->isUser()) {
            $this->events->dispatch(new InboxAccessEnded($event->actor->id, $event->inboxId));
        }
    }
}
