<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionClosed;
use App\Events\Sessions\SessionStartEnded;
use App\Models\Sessions\SessionRequest;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells the owner of the work a session was started for that the session ended, so the owner can record the attempt;
 * a session no owner started is nobody's start.
 */
final readonly class AnnounceSessionStartEnded implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(SessionClosed $event): void
    {
        SessionRequest::findOwnerStartOf($event->sessionId)->forAll(
            fn (SessionRequest $start) => $this->events->dispatch(new SessionStartEnded($start->owner_work)),
        );
    }
}
