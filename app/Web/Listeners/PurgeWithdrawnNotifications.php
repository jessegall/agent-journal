<?php

declare(strict_types=1);

namespace App\Web\Listeners;

use App\Communication\Events\NotificationsWithdrawn;
use App\Contracts\Listener;
use App\Web\Events\ProtectedViewInvalidated;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells a user's open tabs that receipts were taken from them, so they drop what they show before reading again; an
 * agent has no browser to tell.
 */
final readonly class PurgeWithdrawnNotifications implements Listener
{
    public function __construct(private Dispatcher $events) {}

    /**
     * Signals the recipient's own view channel; only a signed-in browser joins one, so a recipient without a view
     * hears nothing.
     */
    public function handle(NotificationsWithdrawn $fact): void
    {
        $this->events->dispatch(new ProtectedViewInvalidated([$fact->recipient->id]));
    }
}
