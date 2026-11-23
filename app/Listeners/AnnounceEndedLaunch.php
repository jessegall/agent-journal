<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\LaunchEnded;
use App\Events\SessionClosed;
use App\Models\Starts\StartRecord;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells the owner of the work a session was started for that the session ended, so the owner can record the attempt;
 * a session no owner started is nobody's launch.
 */
final readonly class AnnounceEndedLaunch implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(SessionClosed $event): void
    {
        StartRecord::ownerStartOf($event->sessionId)->forAll(
            fn (StartRecord $start) => $this->events->dispatch(new LaunchEnded($start->ownerWork())),
        );
    }
}
